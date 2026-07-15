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

export interface ToastContainerProps {
    /** Override the safe-area top inset. */
    topInset?: number;
    /** Partially override the default toast palette. */
    colors?: Partial<ToastColors>;
    /** Style applied to the absolute container around all toasts. */
    style?: StyleProp<ViewStyle>;
    maxToastWidth: number
    swipeDismissThreshold: number
}
