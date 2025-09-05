type FailedAction = {
  error: true;
  message: string;
};

type SuccessAction<T extends Record<any, any>> = {
  error: false;
  result: T;
};

export function failedAction(message: string): FailedAction {
  return { error: true, message };
}

export function successAction<T extends Record<any, any>>(
  payload: T,
): SuccessAction<T> {
  return { error: false, result: payload };
}
