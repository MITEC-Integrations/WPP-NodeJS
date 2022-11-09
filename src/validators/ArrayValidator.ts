import { isValidator, IValidator, Result, Shape } from './IValidator';
import { ShapeValidator } from './ShapeValidator';
import { expect } from 'chai';

export class ArrayValidator<T extends object> implements IValidator<T> {
  constructor(protected shape: Shape<T>, protected optionalKeys?: string[], protected optional: boolean = false) {
    this.optionalKeys = this.optionalKeys || [];
  }

  go: (value: unknown) => Result<T> = (value) => {
    const typeValidResult: (msg: string, opt: boolean) => Result<T> = (msg, opt) => {
      if (!opt) {
        return { ok: false, message: msg };
      } else {
        return { ok: true, value: {} as T };
      }
    };

    // First check that the value is an object and not an array, null, undefined, etc
    if (value === null || value === undefined) {
      return typeValidResult('Value cannot be null or undefined.', this.optional);
    } else if (!Array.isArray(value)) {
      return typeValidResult(`Value must be an array but was an ${typeof value}.`, this.optional);
    }

    // Get the keys of both the expected shape, and the value
    const expectedKeys = Object.getOwnPropertyNames(this.shape);

    // Check if any expected property is missing from the value
    this.optionalKeys = this.optionalKeys || [];

    let output;
    for (const item of value) {
      output = this.validate(item, expectedKeys);
      if (!output.ok) {
        return output;
      }
    }
    return output;
  };

  private validate(item: T, expectedKeys: any[]) {
    const err = (msg: string): Result<T> => ({ ok: false, message: msg });
    const defaultState: Result<T> = { ok: true, value: {} as T };
    const actualKeys = Object.keys(item);
    // Check if any expected property is missing from the value
    for (const expected of expectedKeys) {
      if (!this.optionalKeys!.includes(expected) && actualKeys.indexOf(expected) === -1) {
        return err(`Value is missing expected property ${expected}.`);
      }
    }

    const output = expectedKeys.reduce((state, key) => {
      if (!state.ok) {
        return state;
      }

      // @ts-ignore
      const validator = this.shape[key];
      // @ts-ignore
      const propValue = item[key];

      const result = isValidator(validator) ? validator.go(propValue) : validator(propValue);

      if (!result.ok) {
        result.message = key + '. ' + result.message;
        return result;
      }
      return {
        ok: true,
        value: {
          ...state.value,
          [key]: result.value,
        },
      };
    }, defaultState);
    return output;
  }
}
