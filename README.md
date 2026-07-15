# oh-my-toast

Animated toasts for React Native, powered by Reanimated.

## Development

Install the repository and start the Expo example:

```sh
bun install
bun run example
```

The app in `example/` links the repository root as a local dependency and imports the public package
API from `oh-my-toast`. Its Metro config resolves that import directly to `src/index.ts` and watches
the library source, so edits under `src/` appear through Fast Refresh without rebuilding `lib/`.

After changing `example/metro.config.js`, start Metro once with a clean cache:

```sh
bun --cwd example start --clear
```

After that, the regular `bun run example` command is enough.

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

`Toaster` accepts these optional layout and swipe settings:

| Prop                            | Default | Description                                                                                      |
| ------------------------------- | ------: | ------------------------------------------------------------------------------------------------ |
| `maxToastWidth`                 |   `400` | Maximum toast width in points.                                                                   |
| `swipeDismissThreshold`         |    `80` | Physical horizontal drag distance required to dismiss.                                           |
| `swipeRubberBandCoefficient`    |  `0.28` | Drag resistance. Lower positive values feel heavier; higher values feel looser.                  |
| `swipeDragOpacityDistance`      |   `160` | Visible drag distance over which opacity fades.                                                  |
| `swipeMinimumOpacity`           |  `0.35` | Lowest opacity reached while dragging.                                                           |
| `swipeOpacityAnimationDuration` | `180ms` | Duration of opacity transitions when releasing the toast.                                        |
| `swipeSpringConfig`             |       — | Overrides `damping`, `mass`, and `stiffness` for return and release animations.                  |
| `swipeDistortionConfig`         |       — | Overrides maximum horizontal stretch, vertical compression, and rotation applied while dragging. |

All swipe defaults are exported as `DEFAULT_TOAST_SWIPE_CONFIG`. For example:

```tsx
<Toaster
    swipeRubberBandCoefficient={0.2}
    swipeDistortionConfig={{
        maxStretch: 0.24,
        maxCompression: 0.16,
        maxVerticalStretch: 0,
        verticalTranslationFactor: 0,
        maxRotation: 4,
    }}
    swipeSpringConfig={{ damping: 16, mass: 1, stiffness: 220 }}
/>
```

By default, the toast only deforms and moves horizontally. Vertical compression, vertical
translation, vertical spring stretch, and rotation are disabled unless explicitly configured.

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
