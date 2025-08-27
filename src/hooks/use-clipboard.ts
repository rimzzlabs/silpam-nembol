import { useState, useCallback, useEffect } from "react";

export interface ClipboardState {
	pending: boolean;
	success: boolean;
	error: string | null;
}

const isClipboardAvailable =
	typeof navigator !== "undefined" &&
	typeof navigator.clipboard !== "undefined";

/**
 * `useClipboard` provides functionality to copy to and paste from the clipboard.
 * It returns a state indicating the success or failure of clipboard operations, and functions to perform copy and paste.
 *
 * @param [debounce=3000] - The debounce time in milliseconds for the pasteFromClipboard function. default to 3000
 * @return - An object containing `copyToClipboard` and `pasteFromClipboard` functions, and `state` with success and error information.
 */
function useClipboard(debounce = 3000) {
	const [state, setState] = useState<ClipboardState>({
		pending: false,
		success: false,
		error: null,
	});

	const copyToClipboard = useCallback(async (text: string) => {
		setState((prev) => ({ ...prev, pending: true }));

		if (!isClipboardAvailable) {
			setState((prev) => ({
				...prev,
				error: "Clipboard is not available",
			}));
			return;
		}

		if (!text.trim()) {
			setState((prev) => ({
				...prev,
				error: "Cannot copy empty or whitespace text",
			}));
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			setState({ success: true, error: null, pending: false });
		} catch (_error) {
			setState({ success: false, error: "Failed to copy", pending: false });
		}
	}, []);

	const pasteFromClipboard = useCallback(async () => {
		setState((prev) => ({ ...prev, pending: true }));
		if (!isClipboardAvailable) {
			setState((prev) => ({ ...prev, error: "Clipboard is not available" }));
			return;
		}

		try {
			const text = await navigator.clipboard.readText();
			if (!text.trim()) {
				return "";
			}
			setState({ success: true, error: null, pending: false });
			return text;
		} catch (_error) {
			setState({ success: false, error: "Failed to paste", pending: false });
			return "";
		}
	}, []);

	useEffect(() => {
		if (state.success) {
			const timeoutId = setTimeout(() => {
				setState((prev) => ({ ...prev, success: false }));
			}, debounce);

			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [state.success, debounce]);

	return { copyToClipboard, pasteFromClipboard, state };
}

export { useClipboard };
