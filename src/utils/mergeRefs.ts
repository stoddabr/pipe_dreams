import { ForwardedRef, MutableRefObject } from "react";

export function mergeRefs<T>(
  ...refs: (MutableRefObject<T> | ForwardedRef<T>)[]
) {
  return (instance: T): void => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    }
  };
}
