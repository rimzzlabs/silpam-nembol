import { useEffect } from "react";

interface UseIntervalOptions {
	/** @default 1000 in milliseconds */
	delay?: number;
	enabled: boolean;
}
export function useInterval(options: UseIntervalOptions, callback: () => void) {
	useEffect(() => {
		let intervalId = setInterval(callback, options?.delay ?? 1000);

		if (!options.enabled) {
			clearInterval(intervalId);
			return;
		}

		return () => clearInterval(intervalId);
	}, [options.enabled, options.delay, callback]);
}
