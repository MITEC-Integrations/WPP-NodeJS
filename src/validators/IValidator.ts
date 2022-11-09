export type Result<T> = { ok: true; value: T } | { ok: false; message: string };

export interface IValidator<T> {
  go(value: unknown): Result<T>;
}

export type PropertyValidator<T> = IValidator<T> | ((value: unknown) => Result<T>);

/**
 * Takes the <T> type and requires all of its properties to be a PropertyValidator.
 */
export type Shape<T extends object> = Record<keyof T, PropertyValidator<any>>;

/**
 * Determines whether the value is an IValidator by checking for a .go function.
 */
export function isValidator<T>(value: unknown): value is IValidator<T> {
  // Check if the value has a .go function. If so, it's an IValidator
  return typeof (value as IValidator<T>).go === 'function';
}
