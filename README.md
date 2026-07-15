# oh-my-toast

Animated toasts for React Native, powered by Reanimated.

## Development

Install the repository and start the Expo example:

```sh
bun install
bun run example
```

The app in `example/` links the repository root as a local dependency and imports the public package
API from `oh-my-toast`.

## Usage

Install the package and its native peer dependencies:

```sh
npm install oh-my-toast react-native-gesture-handler react-native-reanimated \
  react-native-safe-area-context react-native-svg react-native-worklets
```

Mount the toaster once near the root of the app. It must be inside Gesture Handler and safe-area
providers:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "oh-my-toast";

export function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <YourApp />
                <Toaster />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
```

Show a toast from anywhere:

```tsx
import { toast } from "oh-my-toast";

toast.success("Saved successfully!");
toast.error("Something went wrong.");
toast.info({
    title: "Heads up",
    body: "Here is some useful information.",
});

const toastId = toast.success("Swipe me away", 10_000);
toast.dismiss(toastId);
toast.clear();
```

## Commands

```sh
bun run build
bun run typecheck
bun run format
bun run format:check
npm pack --dry-run
```
