import type { ChangeEvent } from "react";
import { numericStringOnly } from "./string";

export function onChangeNumericOnly(
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void,
) {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const value = numericStringOnly(e.target.value);
    const newEvent = { ...e, target: { ...e.target, value } };
    onValueChange(newEvent);
  };
}

export function preventDefault<E extends Event>(e: E) {
  e.preventDefault();
}

export function preventPropagate<E extends Event>(e: E) {
  e.stopPropagation();
}
