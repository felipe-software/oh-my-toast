import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyToast } from "oh-my-toast";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.intro}>
                    <ThemedText type="title">oh-my-toast</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        The example imports directly from the local npm workspace package.
                    </ThemedText>
                </View>

                <View style={styles.actions}>
                    <DemoButton
                        backgroundColor="#2B9A66"
                        label="Success toast"
                        onPress={() => MyToast.success("Operation completed successfully!")}
                    />
                    <DemoButton
                        backgroundColor="#DC2626"
                        label="Error toast"
                        onPress={() => MyToast.error("Something went wrong.")}
                    />
                    <DemoButton
                        backgroundColor={colors.backgroundElement}
                        label="Info toast"
                        labelColor={colors.text}
                        onPress={() =>
                            MyToast.info({
                                title: "Heads up",
                                body: "Swipe sideways to dismiss this info toast.",
                            })
                        }
                    />
                    <Pressable onPress={() => MyToast.clear()} style={styles.clearButton}>
                        <Text style={[styles.clearLabel, { color: colors.textSecondary }]}>
                            Clear all
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

interface DemoButtonProps {
    backgroundColor: string;
    label: string;
    labelColor?: string;
    onPress: () => void;
}

function DemoButton({ backgroundColor, label, labelColor = "#FFFFFF", onPress }: DemoButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor, opacity: pressed ? 0.72 : 1 },
            ]}>
            <Text style={[styles.buttonLabel, { color: labelColor }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: "center",
        paddingBottom: BottomTabInset,
        paddingHorizontal: Spacing.four,
    },
    intro: {
        gap: Spacing.two,
        marginBottom: Spacing.five,
    },
    subtitle: {
        lineHeight: 22,
        opacity: 0.7,
    },
    actions: {
        gap: Spacing.three,
    },
    button: {
        alignItems: "center",
        borderRadius: 16,
        minHeight: 52,
        justifyContent: "center",
        paddingHorizontal: Spacing.four,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
    clearButton: {
        alignItems: "center",
        minHeight: 44,
        justifyContent: "center",
    },
    clearLabel: {
        fontSize: 14,
        fontWeight: "500",
    },
});
