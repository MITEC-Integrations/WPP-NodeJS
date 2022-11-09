import { IValidator, Result } from './IValidator';

type StringRule =
  | { type: 'equal'; value: string }
  | { type: 'notEqual'; value: string }
  | { type: 'minLength'; min: number }
  | { type: 'maxLength'; max: number }
  | { type: 'exists'; values: string[] };

export class StringValidator implements IValidator<string> {
  private _optional!: boolean;

  constructor(private rules?: StringRule[]) {
    if (!Array.isArray(this.rules)) {
      this.rules = [];
    }
    this.rules = rules;
  }

  /**
   * Adds a rule to the array of rules, or replaces a rule if it already exists.
   * Use this function to prevent having multiple rules of the same type.
   */
  private addRule: (rule: StringRule) => StringRule[] = (rule) => {
    // Filter the current rule set, removing any rule that has the same type of the one being added
    const filtered = this.rules?.filter((r) => r.type !== rule.type) || [];

    // Add the new rule to the filtered rule array
    return [...filtered, rule];
  };

  /**
   * Mark this value as optional.
   */
  optional(flag: boolean): StringValidator {
    this._optional = flag;
    return this;
  }

  /**
   * Fails if the value being validated is not equal to @param value.
   */
  equals: (value: string) => StringValidator = (value) => {
    this.rules = this.addRule({ type: 'equal', value });
    return this;
  };

  /**
   * Fails if the value being validated is equal to @param value.
   */
  notEquals: (value: string) => StringValidator = (value) => {
    this.rules = this.addRule({ type: 'notEqual', value });
    return this;
  };

  /**
   * Fails if the string's length is less than @param min.
   */
  minLength: (min: number) => StringValidator = (min) => {
    this.rules = this.addRule({ type: 'minLength', min });
    return this;
  };

  /**
   * Fails if the string's length is greater than @param max.
   */
  maxLength: (max: number) => StringValidator = (max) => {
    this.rules = this.addRule({ type: 'maxLength', max });
    return this;
  };

  /**
   * Fails if the string is empty.
   */
  notEmpty: () => StringValidator = () => {
    // We don't need to use a specific rule for notEmpty here, we can just set a min length of 1!
    this.rules = this.addRule({ type: 'minLength', min: 1 });
    return this;
  };

  /**
   * Fails if the string is not empty. NOTE that an empty string is _not_ the same as a null or undefined value.
   */
  empty: () => StringValidator = () => {
    // Again, we don't need a specific rule for empty, we just set a max length of 0
    this.rules = this.addRule({ type: 'maxLength', max: 0 });
    return this;
  };

  exists: (values: string[]) => StringValidator = (values) => {
    this.rules = this.addRule({ type: 'exists', values });
    return this;
  };

  /**
   * Checks an individual rule against the value being validated.
   */
  checkRule: (rule: StringRule, value: string) => Result<string> = (rule, value) => {
    const err = (msg: string): Result<string> => ({ ok: false, message: msg });
    const ok = (): Result<string> => ({ ok: true, value });

    switch (rule.type) {
      case 'equal':
        return rule.value !== value ? err(`Value was expected to be ${rule.value} but was ${value}.`) : ok();

      case 'notEqual':
        return rule.value === value ? err(`Value must not be ${rule.value}.`) : ok();

      case 'minLength':
        return (value?.length || 0) < rule.min
          ? err(`Length must be greater than or equal to ${rule.min} but was ${value.length}.`)
          : ok();

      case 'maxLength':
        return (value?.length || 0) > rule.max
          ? err(`Length must be less than or equal to ${rule.max} but was ${value.length}.`)
          : ok();

      case 'exists':
        return !rule.values?.includes(value)
          ? err(`Value was expected to be one of: ${rule.values.forEach((item) => item)} but was ${value}`)
          : ok();
    }
  };

  go: (value: unknown) => Result<string> = (value) => {
    const typeValidResult: (msg: string, opt: boolean) => Result<string> = (msg, opt) => {
      if (!opt) {
        return { ok: false, message: msg };
      } else {
        return { ok: true, value: '' };
      }
    };
    if (value === null) {
      return typeValidResult('StringValidator expected a string but received null.', this._optional);
    } else if (value === undefined) {
      return typeValidResult('StringValidator expected a string but received undefined.', this._optional);
    } else if (typeof value !== 'string') {
      return typeValidResult(`StringValidator expected a string but received ${typeof value}.`, this._optional);
    }

    // TypeScript compiler now knows that value is a string
    // Iterate over all rules and short-circuit to return an error if any rule fails
    for (const rule of this.rules!) {
      const result = this.checkRule(rule, value);

      if (result.ok === false) {
        return result;
      }
    }

    // If none of the rules in the loop had an error, the value passed validation!
    return {
      ok: true,
      value,
    };
  };
}
