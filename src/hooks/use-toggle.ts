import { useCallback, useState } from "react";

export function useToggle(initialValue = false) {
	let [open, setOpen] = useState(initialValue);

	let toggle = useCallback((nextValue?: boolean) => {
		setOpen((prev) => nextValue ?? !prev);
	}, []);

	return [open, toggle] as const;
}
