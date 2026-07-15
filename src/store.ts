import { useSyncExternalStore } from "react";

import type { ToastId, ToastInput, ToastItem } from "./types";

const DEFAULT_DURATION = 5_000;
const listeners = new Set<() => void>();
const timers = new Map<ToastId, ReturnType<typeof setTimeout>>();
let nextId = 0;

interface ToastStore {
    toasts: ToastItem[];
    addToast: (toast: ToastInput) => ToastId;
    removeToast: (id: ToastId) => void;
    clearToasts: () => void;
}

function clearToastTimer(id: ToastId) {
    const timer = timers.get(id);

    if (timer) {
        clearTimeout(timer);
        timers.delete(id);
    }
}

function emitChange() {
    for (const listener of listeners) {
        listener();
    }
}

function setToasts(toasts: ToastItem[]) {
    state = { ...state, toasts };
    emitChange();
}

function removeToast(id: ToastId) {
    clearToastTimer(id);
    setToasts(state.toasts.filter((item) => item.id !== id));
}

function clearToasts() {
    for (const toast of state.toasts) {
        clearToastTimer(toast.id);
    }

    setToasts([]);
}

function addToast(toast: ToastInput): ToastId {
    const id = `${Date.now()}-${nextId++}`;
    const newToast: ToastItem = {
        ...toast,
        id,
        duration: toast.duration ?? DEFAULT_DURATION,
    };

    setToasts([...state.toasts, newToast]);

    if (newToast.duration > 0) {
        timers.set(
            id,
            setTimeout(() => {
                timers.delete(id);
                setToasts(state.toasts.filter((item) => item.id !== id));
            }, newToast.duration),
        );
    }

    return id;
}

let state: ToastStore = {
    toasts: [],
    addToast,
    removeToast,
    clearToasts,
};

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getState() {
    return state;
}

function useToastStoreHook<T = ToastStore>(
    selector: (store: ToastStore) => T = ((store) => store) as (store: ToastStore) => T,
) {
    return useSyncExternalStore(
        subscribe,
        () => selector(state),
        () => selector(state),
    );
}

export const useToastStore = Object.assign(useToastStoreHook, {
    getState,
    subscribe,
});
