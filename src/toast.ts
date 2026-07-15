import { useToastStore } from "./store";
import type { InfoOptions, ToastId } from "./types";

export const MyToast = {
    success(message: string, duration?: number): ToastId {
        return useToastStore.getState().addToast({
            type: "success",
            message,
            duration,
        });
    },

    error(message: string, duration = 10_000): ToastId {
        return useToastStore.getState().addToast({
            type: "error",
            message,
            duration,
        });
    },

    info(options: InfoOptions): ToastId {
        return useToastStore.getState().addToast({
            type: "info",
            title: options.title,
            message: options.body,
            duration: options.duration ?? 6_000,
            onPress: options.onPress,
        });
    },

    dismiss(id: ToastId) {
        useToastStore.getState().removeToast(id);
    },

    clear() {
        useToastStore.getState().clearToasts();
    },
};

export const toast = MyToast;
