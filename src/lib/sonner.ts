import { toast } from "sonner";

export type WithSonnerPromiseOptions = Partial<{
  loading: string;
  success: string;
  error: string | ((error: Error) => string);
}> & {
  onSettled?: () => void;
};

/**
 * Wraps a promise-returning function with Sonner toast notifications.
 * **!IMPORTANT: THE CALLBACK FUNCTION SHOULD THROW AN ERROR IF IT FAILS**
 *
 * @template A - The argument types of the function.
 * @template R - The return type of the promise.
 *
 * @param {(...args: A) => Promise<R>} fn - The function that returns a promise.
 * @param {WithSonnerPromiseOptions} [options] - Optional configuration for toast messages and a callback.
 *
 * @returns  - A function that, when called, executes `fn` and displays toast notifications.
 */
export function withSonnerPromise<A extends Array<any>, R>(
  fn: (...args: A) => Promise<R> | R,
  options?: WithSonnerPromiseOptions,
) {
  let texts = {
    loading: options?.loading ?? "Memproses permintaan",
    success: options?.success ?? "Permintaan berhasil",
    error: options?.error ?? "Permintaan gagal, harap coba lagi nanti",
  };

  return async (...args: A) => {
    toast.dismiss();
    return await toast
      .promise(fn(...args) as Promise<R>, {
        ...texts,
        finally: options?.onSettled,
      })
      .unwrap();
  };
}
