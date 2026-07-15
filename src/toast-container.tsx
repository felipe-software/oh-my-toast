import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    type TextStyle,
    type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    FadeInUp,
    FadeOutUp,
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleCheck, CircleX, Info as InfoIcon } from "lucide-react-native";

import { useToastStore } from "./store";
import type { ToastColors, ToastContainerProps, ToastItem } from "./types";

const SWIPE_DISMISS_THRESHOLD = 80;
const MAX_TOAST_WIDTH = 400;

const defaultColors: ToastColors = {
    successBackground: "#2B9A66",
    successIcon: "#10B981",
    errorBackground: "#DC2626",
    errorIcon: "#FFFFFF",
    infoBackground: "#52525B",
    infoIcon: "#FFFFFF",
    text: "#FFFFFF",
};

interface ToastItemComponentProps {
    colors: ToastColors;
    maxWidth: number;
    toast: ToastItem;
}

function ToastItemComponent({ colors, maxWidth, toast }: ToastItemComponentProps) {
    const removeToast = useToastStore((state) => state.removeToast);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const handleRemove = () => {
        removeToast(toast.id);
    };

    const handlePress = () => {
        toast.onPress?.();
        removeToast(toast.id);
    };

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
            translateX.value = event.translationX;
            opacity.value = Math.max(1 - Math.abs(event.translationX) / 200, 0.4);
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_DISMISS_THRESHOLD) {
                const exitX = event.translationX > 0 ? 500 : -500;
                translateX.value = withTiming(exitX, { duration: 180 }, () => {
                    runOnJS(handleRemove)();
                });
                opacity.value = withTiming(0, { duration: 180 });
                return;
            }

            translateX.value = withSpring(0);
            opacity.value = withSpring(1);
        });

    const swipeStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateX: translateX.value }],
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

export function ToastContainer({ colors: colorOverrides, style, topInset }: ToastContainerProps) {
    const toasts = useToastStore((state) => state.toasts);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const colors = { ...defaultColors, ...colorOverrides };
    const maxWidth = Math.min(MAX_TOAST_WIDTH, width - 32);

    return (
        <View
            pointerEvents="box-none"
            style={[styles.container, { paddingTop: topInset ?? insets.top }, style]}>
            {toasts.map((item) => (
                <ToastItemComponent
                    colors={colors}
                    key={item.id}
                    maxWidth={maxWidth}
                    toast={item}
                />
            ))}
        </View>
    );
}

export const Toaster = ToastContainer;

interface Styles {
    container: ViewStyle;
    itemSpacing: ViewStyle;
    message: TextStyle;
    messageToast: ViewStyle;
    infoContent: ViewStyle;
    infoMessage: TextStyle;
    infoToast: ViewStyle;
    title: TextStyle;
    toast: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        alignItems: "center",
        elevation: 9999,
        left: 0,
        paddingHorizontal: 16,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 9999,
    },
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
