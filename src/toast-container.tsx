import { StyleSheet, useWindowDimensions, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToastStore } from "./store";
import { ToastItemComponent } from "./toast-item";
import type { ToastColors, ToastContainerProps } from "./types";

export const DEFAULT_TOAST_SWIPE_CONFIG = {
    dismissThreshold: 80,
    distortion: {
        maxCompression: 0,
        maxRotation: 0,
        maxStretch: 0.18,
        maxVerticalStretch: 0,
        verticalTranslationFactor: 0,
    },
    dragOpacityDistance: 160,
    minimumOpacity: 0.35,
    opacityAnimationDuration: 180,
    rubberBandCoefficient: 0.28,
    spring: {
        damping: 18,
        mass: 0.9,
        stiffness: 240,
    },
} as const;

const defaultColors: ToastColors = {
    successBackground: "#2B9A66",
    successIcon: "#10B981",
    errorBackground: "#DC2626",
    errorIcon: "#FFFFFF",
    infoBackground: "#52525B",
    infoIcon: "#FFFFFF",
    text: "#FFFFFF",
};

export const ToastContainer = ({
    colors: colorOverrides,
    swipeDistortionConfig,
    swipeDragOpacityDistance = DEFAULT_TOAST_SWIPE_CONFIG.dragOpacityDistance,
    style,
    topInset,
    swipeDismissThreshold = DEFAULT_TOAST_SWIPE_CONFIG.dismissThreshold,
    swipeMinimumOpacity = DEFAULT_TOAST_SWIPE_CONFIG.minimumOpacity,
    swipeOpacityAnimationDuration = DEFAULT_TOAST_SWIPE_CONFIG.opacityAnimationDuration,
    swipeRubberBandCoefficient = DEFAULT_TOAST_SWIPE_CONFIG.rubberBandCoefficient,
    swipeSpringConfig,
    maxToastWidth = 400,
}: ToastContainerProps) => {
    const toasts = useToastStore((state) => state.toasts);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const colors = { ...defaultColors, ...colorOverrides };
    const maxWidth = Math.min(maxToastWidth, width - 32);
    const dismissThreshold = positiveOrDefault(
        swipeDismissThreshold,
        DEFAULT_TOAST_SWIPE_CONFIG.dismissThreshold,
    );
    const rubberBandCoefficient = positiveOrDefault(
        swipeRubberBandCoefficient,
        DEFAULT_TOAST_SWIPE_CONFIG.rubberBandCoefficient,
    );
    const dragOpacityDistance = positiveOrDefault(
        swipeDragOpacityDistance,
        DEFAULT_TOAST_SWIPE_CONFIG.dragOpacityDistance,
    );
    const minimumOpacity = clampOrDefault(
        swipeMinimumOpacity,
        0,
        1,
        DEFAULT_TOAST_SWIPE_CONFIG.minimumOpacity,
    );
    const opacityAnimationDuration = nonNegativeOrDefault(
        swipeOpacityAnimationDuration,
        DEFAULT_TOAST_SWIPE_CONFIG.opacityAnimationDuration,
    );
    const springConfig = {
        damping: positiveOrDefault(
            swipeSpringConfig?.damping,
            DEFAULT_TOAST_SWIPE_CONFIG.spring.damping,
        ),
        mass: positiveOrDefault(swipeSpringConfig?.mass, DEFAULT_TOAST_SWIPE_CONFIG.spring.mass),
        stiffness: positiveOrDefault(
            swipeSpringConfig?.stiffness,
            DEFAULT_TOAST_SWIPE_CONFIG.spring.stiffness,
        ),
    };
    const distortionConfig = {
        maxCompression: clampOrDefault(
            swipeDistortionConfig?.maxCompression,
            0,
            0.9,
            DEFAULT_TOAST_SWIPE_CONFIG.distortion.maxCompression,
        ),
        maxRotation: nonNegativeOrDefault(
            swipeDistortionConfig?.maxRotation,
            DEFAULT_TOAST_SWIPE_CONFIG.distortion.maxRotation,
        ),
        maxStretch: nonNegativeOrDefault(
            swipeDistortionConfig?.maxStretch,
            DEFAULT_TOAST_SWIPE_CONFIG.distortion.maxStretch,
        ),
        maxVerticalStretch: nonNegativeOrDefault(
            swipeDistortionConfig?.maxVerticalStretch,
            DEFAULT_TOAST_SWIPE_CONFIG.distortion.maxVerticalStretch,
        ),
        verticalTranslationFactor: nonNegativeOrDefault(
            swipeDistortionConfig?.verticalTranslationFactor,
            DEFAULT_TOAST_SWIPE_CONFIG.distortion.verticalTranslationFactor,
        ),
    };

    return (
        <View
            pointerEvents="box-none"
            style={[styles.container, { paddingTop: topInset ?? insets.top }, style]}>
            {toasts.map((item) => (
                <ToastItemComponent
                    colors={colors}
                    distortionConfig={distortionConfig}
                    dragOpacityDistance={dragOpacityDistance}
                    key={item.id}
                    maxWidth={maxWidth}
                    minimumOpacity={minimumOpacity}
                    opacityAnimationDuration={opacityAnimationDuration}
                    springConfig={springConfig}
                    swipeDismissThreshold={dismissThreshold}
                    swipeRubberBandCoefficient={rubberBandCoefficient}
                    toast={item}
                    viewportWidth={width}
                />
            ))}
        </View>
    );
};

export const Toaster = ToastContainer;

function positiveOrDefault(value: number | undefined, defaultValue: number) {
    return value !== undefined && Number.isFinite(value) && value > 0 ? value : defaultValue;
}

function nonNegativeOrDefault(value: number | undefined, defaultValue: number) {
    return value !== undefined && Number.isFinite(value) && value >= 0 ? value : defaultValue;
}

function clampOrDefault(value: number | undefined, min: number, max: number, defaultValue: number) {
    return value !== undefined && Number.isFinite(value)
        ? Math.min(Math.max(value, min), max)
        : defaultValue;
}

interface Styles {
    container: ViewStyle;
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
});
