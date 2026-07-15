import type { StyleProp, ViewStyle } from "react-native";

export type ToastId = string;
export type ToastType = "success" | "error" | "info";

export interface ToastItem {
    id: ToastId;
    type: ToastType;
    message: string;
    title?: string;
    duration: number;
    onPress?: () => void;
}

export interface ToastInput extends Omit<ToastItem, "id" | "duration"> {
    duration?: number;
}

export interface InfoOptions {
    title?: string;
    body: string;
    onPress?: () => void;
    duration?: number;
}

export interface ToastColors {
    successBackground: string;
    successIcon: string;
    errorBackground: string;
    errorIcon: string;
    infoBackground: string;
    infoIcon: string;
    text: string;
}

export interface ToastSwipeSpringConfig {
    damping?: number;
    mass?: number;
    stiffness?: number;
}

export interface ToastSwipeDistortionConfig {
    /** Maximum horizontal stretch added while dragging. Defaults to 0.18. */
    maxStretch?: number;
    /** Maximum vertical compression applied while dragging. Defaults to 0. */
    maxCompression?: number;
    /** Maximum vertical spring stretch above the resting size. Defaults to 0. */
    maxVerticalStretch?: number;
    /** Portion of vertical finger movement applied to the toast. Defaults to 0. */
    verticalTranslationFactor?: number;
    /** Maximum rotation in degrees while dragging. Defaults to 0. */
    maxRotation?: number;
}

export interface ToastContainerProps {
    /** Override the safe-area top inset. */
    topInset?: number;
    /** Partially override the default toast palette. */
    colors?: Partial<ToastColors>;
    /** Style applied to the absolute container around all toasts. */
    style?: StyleProp<ViewStyle>;
    /** Maximum toast width in points. Defaults to 400. */
    maxToastWidth?: number;
    /** Horizontal drag distance required to dismiss a toast. Defaults to 80 points. */
    swipeDismissThreshold?: number;
    /** Rubber-band resistance coefficient. Lower values resist more. Defaults to 0.28. */
    swipeRubberBandCoefficient?: number;
    /** Visible drag distance over which opacity fades. Defaults to 160 points. */
    swipeDragOpacityDistance?: number;
    /** Lowest opacity reached while dragging. Defaults to 0.35. */
    swipeMinimumOpacity?: number;
    /** Duration of swipe opacity transitions. Defaults to 180ms. */
    swipeOpacityAnimationDuration?: number;
    /** Physics used when the toast returns or is released. */
    swipeSpringConfig?: ToastSwipeSpringConfig;
    /** Stretch, squash, and rotation applied during the rubber-band drag. */
    swipeDistortionConfig?: ToastSwipeDistortionConfig;
}
