import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from "react";

export function useDismissOutside<
  E extends HTMLElement,
  EL extends HTMLElement = HTMLElement,
>(
  onClickOutside: (event: Event) => void,
  includeThisElement?: RefObject<EL | null>,
) {
  let ref = useRef<E | null>(null);
  let refCallback = useRef(onClickOutside);

  useLayoutEffect(() => {
    refCallback.current = onClickOutside;
  });

  const handler = useCallback(
    (event: Event) => {
      const referedElement = ref.current;
      if (includeThisElement?.current?.contains(event.target as Node)) {
        return;
      }

      if (referedElement && !referedElement.contains(event.target as Node)) {
        refCallback.current(event);
      }
    },
    [includeThisElement],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [handler]);

  return ref;
}
