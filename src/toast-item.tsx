import {
    Pressable,
    StyleSheet,
    Text,
    View,
    type LayoutChangeEvent,
    type TextStyle,
    type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    cancelAnimation,
    FadeInUp,
    FadeOutUp,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { CircleCheck, CircleX, Info as InfoIcon } from "lucide-react-native";

import { rubberBand } from "./rubber-band";
import { useToastStore } from "./store";
import type {
    ToastColors,
    ToastItem,
    ToastSwipeDistortionConfig,
    ToastSwipeSpringConfig,
} from "./types";

interface ToastItemComponentProps {
    colors: ToastColors;
    distortionConfig: Required<ToastSwipeDistortionConfig>;
    dragOpacityDistance: number;
    maxWidth: number;
    minimumOpacity: number;
    opacityAnimationDuration: number;
    springConfig: Required<ToastSwipeSpringConfig>;
    swipeDismissThreshold: number;
    swipeRubberBandCoefficient: number;
    toast: ToastItem;
    viewportWidth: number;
}

export function ToastItemComponent({
    colors,
    distortionConfig,
    dragOpacityDistance,
    maxWidth,
    minimumOpacity,
    opacityAnimationDuration,
    springConfig,
    swipeDismissThreshold,
    swipeRubberBandCoefficient,
    toast,
    viewportWidth,
}: ToastItemComponentProps) {
    const removeToast = useToastStore((state) => state.removeToast);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const dragOriginX = useSharedValue(0);
    const toastWidth = useSharedValue(maxWidth);
    const toastHeight = useSharedValue(44);
    const scaleX = useSharedValue(1);
    const scaleY = useSharedValue(1);
    const rotation = useSharedValue(0);
    const toastId = toast.id;

    const handlePress = () => {
        toast.onPress?.();
        removeToast(toastId);
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        toastWidth.value = event.nativeEvent.layout.width;
        toastHeight.value = event.nativeEvent.layout.height;
    };

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onStart(() => {
            cancelAnimation(translateX);
            cancelAnimation(translateY);
            cancelAnimation(opacity);
            cancelAnimation(scaleX);
            cancelAnimation(scaleY);
            cancelAnimation(rotation);
            dragOriginX.value = translateX.value;
        })
        .onUpdate((event) => {
            const dampedTranslation = rubberBand(
                event.translationX,
                toastWidth.value,
                swipeRubberBandCoefficient,
            );
            const nextTranslateX = dragOriginX.value + dampedTranslation;
            const nextTranslateY =
                distortionConfig.verticalTranslationFactor === 0
                    ? 0
                    : rubberBand(
                          event.translationY,
                          toastHeight.value,
                          swipeRubberBandCoefficient,
                      ) * distortionConfig.verticalTranslationFactor;
            const distortionProgress = Math.min(
                Math.abs(event.translationX) / swipeDismissThreshold,
                1,
            );
            const direction = event.translationX >= 0 ? 1 : -1;

            translateX.value = nextTranslateX;
            translateY.value = nextTranslateY;
            opacity.value = Math.max(
                1 - Math.abs(nextTranslateX) / dragOpacityDistance,
                minimumOpacity,
            );
            scaleX.value = 1 + distortionProgress * distortionConfig.maxStretch;
            scaleY.value = 1 - distortionProgress * distortionConfig.maxCompression;
            rotation.value = direction * distortionProgress * distortionConfig.maxRotation;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) >= swipeDismissThreshold) {
                const direction = event.translationX >= 0 ? 1 : -1;
                const directionalVelocity = Math.max(direction * event.velocityX, 0) * direction;
                const exitX = direction * (viewportWidth + toastWidth.value);

                translateX.value = withSpring(
                    exitX,
                    { ...springConfig, velocity: directionalVelocity },
                    (finished) => {
                        if (finished) {
                            scheduleOnRN(removeToast, toastId);
                        }
                    },
                );
                opacity.value = withTiming(0, { duration: opacityAnimationDuration });
                translateY.value = withSpring(0, springConfig);
                scaleX.value = withSpring(1, springConfig);
                scaleY.value = withSpring(1, {
                    ...springConfig,
                    overshootClamping: distortionConfig.maxVerticalStretch === 0,
                });
                rotation.value = withSpring(0, springConfig);
                return;
            }

            translateX.value = withSpring(0, springConfig);
            translateY.value = withSpring(0, springConfig);
            opacity.value = withTiming(1, { duration: opacityAnimationDuration });
            scaleX.value = withSpring(1, springConfig);
            scaleY.value = withSpring(1, {
                ...springConfig,
                overshootClamping: distortionConfig.maxVerticalStretch === 0,
            });
            rotation.value = withSpring(0, springConfig);
        })
        .onFinalize((_event, success) => {
            if (success) {
                return;
            }

            translateX.value = withSpring(0, springConfig);
            translateY.value = withSpring(0, springConfig);
            opacity.value = withTiming(1, { duration: opacityAnimationDuration });
            scaleX.value = withSpring(1, springConfig);
            scaleY.value = withSpring(1, {
                ...springConfig,
                overshootClamping: distortionConfig.maxVerticalStretch === 0,
            });
            rotation.value = withSpring(0, springConfig);
        });

    const swipeStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotateZ: `${rotation.value}deg` },
            { scaleX: scaleX.value },
            {
                scaleY: Math.min(scaleY.value, 1 + distortionConfig.maxVerticalStretch),
            },
        ],
    }));

    const isInfo = toast.type === "info";
    const backgroundColor =
        toast.type === "error"
            ? colors.errorBackground
            : toast.type === "info"
              ? colors.infoBackground
              : colors.successBackground;

    let icon = <CircleX color={colors.errorIcon} size={20} />;

    if (toast.type === "success") {
        icon = <CircleCheck color={colors.successIcon} size={20} />;
    } else if (isInfo) {
        icon = <InfoIcon color={colors.infoIcon} size={20} />;
    }

    return (
        <Animated.View
            entering={FadeInUp.springify().damping(35).stiffness(400).mass(0.8)}
            exiting={FadeOutUp.duration(300)}
            layout={LinearTransition.springify().damping(35).stiffness(400)}
            style={styles.itemSpacing}>
            <GestureDetector gesture={swipeGesture}>
                <Animated.View style={swipeStyle}>
                    <Pressable
                        accessibilityLiveRegion="polite"
                        accessibilityRole="alert"
                        onLayout={handleLayout}
                        onPress={handlePress}
                        style={[
                            styles.toast,
                            isInfo ? styles.infoToast : styles.messageToast,
                            { backgroundColor, maxWidth },
                        ]}>
                        {icon}
                        {isInfo ? (
                            <View style={styles.infoContent}>
                                {toast.title ? (
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.title, { color: colors.text }]}>
                                        {toast.title}
                                    </Text>
                                ) : null}
                                <Text
                                    numberOfLines={2}
                                    style={[styles.infoMessage, { color: colors.text }]}>
                                    {toast.message}
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.message, { color: colors.text }]}>
                                {toast.message}
                            </Text>
                        )}
                    </Pressable>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
}

interface Styles {
    infoContent: ViewStyle;
    infoMessage: TextStyle;
    infoToast: ViewStyle;
    itemSpacing: ViewStyle;
    message: TextStyle;
    messageToast: ViewStyle;
    title: TextStyle;
    toast: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
    itemSpacing: {
        marginBottom: 12,
    },
    toast: {
        alignItems: "center",
        borderRadius: 999,
        flexDirection: "row",
        minHeight: 44,
        minWidth: 272,
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: "#000000",
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    messageToast: {
        justifyContent: "center",
    },
    infoToast: {
        justifyContent: "flex-start",
    },
    message: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 4,
        textAlign: "center",
    },
    infoContent: {
        flex: 1,
        marginLeft: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
    },
    infoMessage: {
        fontSize: 12,
        opacity: 0.9,
    },
});
