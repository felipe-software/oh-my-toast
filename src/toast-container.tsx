import { StyleSheet, useWindowDimensions, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToastStore } from "./store";
import { ToastItemComponent } from "./toast-item";
import type { ToastColors, ToastContainerProps } from "./types";

const defaultColors: ToastColors = {
    successBackground: "#2B9A66",
    successIcon: "#10B981",
    errorBackground: "#DC2626",
    errorIcon: "#FFFFFF",
    infoBackground: "#52525B",
    infoIcon: "#FFFFFF",
    text: "#FFFFFF",
};

const ToastContainer = ({
    colors: colorOverrides,
    style,
    topInset,
    swipeDismissThreshold = 80,
    maxToastWidth = 400,
}: ToastContainerProps) => {
    const toasts = useToastStore((state) => state.toasts);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const colors = { ...defaultColors, ...colorOverrides };
    const maxWidth = Math.min(maxToastWidth, width - 32);

    return (
        <View
            pointerEvents="box-none"
            style={[styles.container, { paddingTop: topInset ?? insets.top }, style]}>
            {toasts.map((item) => (
                <ToastItemComponent
                    colors={colors}
                    key={item.id}
                    maxWidth={maxWidth}
                    swipeDismissThreshold={swipeDismissThreshold}
                    toast={item}
                />
            ))}
        </View>
    );
};

export const Toaster = ToastContainer;

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
