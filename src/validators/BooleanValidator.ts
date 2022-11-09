import { IValidator, Result } from './IValidator';

type BooleanRule =
  | { type: 'equal'; value: boolean }
  | { type: 'notEqual'; value: boolean }
  | { type: 'notEmpty' }
  | { type: 'empty' };

export class BooleanValidator implements IValidator<boolean> {
  private _optional!: boolean;

  constructor(private rules?: BooleanRule[]) {
    if (!Array.isArray(this.rules)) {
      this.rules = [];
    }
    this.rules = rules;
  }

  /**
   * Adds a rule to the array of rules, or replaces a rule if it already exists.
   * Use this function to prevent having multiple rules of the same type.
   */
  private addRule: (rule: BooleanRule) => BooleanRule[] = (rule) => {
    // Filter the current rule set, removing any rule that has the same type of the one being added
    const filtered = this.rules?.filter((r) => r.type !== rule.type) || [];

    // Add the new rule to the filtered rule array
    return [...filtered, rule];
  };

  /**
   * Mark this value as optional.
   */
  optional(flag: boolean): BooleanValidator {
    this._optional = flag;
    return this;
  }

  /**
   * Fails if the value being validated is not equal to @param value.
   */
  equals: (value: boolean) => BooleanValidator = (value) => {
    this.rules = this.addRule({ type: 'equal', value });
    return this;
  };

  /**
   * Fails if the value being validated is equal to @param value.
   */
  notEquals: (value: boolean) => BooleanValidator = (value) => {
    this.rules = this.addRule({ type: 'notEqual', value });
    return this;
  };

  /**
   * Fails if the value is not empty.
   */
  notEmpty: () => BooleanValidator = () => {
    // We don't need to use a specific rule for notEmpty here, we can just set a min length of 1!
    this.rules = this.addRule({ type: 'notEmpty' });
    return this;
  };

  /**
   * Fails if the value is empty.
   */
  empty: () => BooleanValidator = () => {
    // We don't need to use a specific rule for notEmpty here, we can just set a min length of 1!
    this.rules = this.addRule({ type: 'empty' });
    return this;
  };

  /**
   * Checks an individual rule against the value being validated.
   */
  checkRule: (rule: BooleanRule, value: boolean) => Result<boolean> = (rule, value) => {
    const err = (msg: string): Result<boolean> => ({ ok: false, message: msg });
    const ok = (): Result<boolean> => ({ ok: true, value });

    switch (rule.type) {
      case 'equal':
        return rule.value !== value ? err(`Value was expected to be ${rule.value} but was ${value}.`) : ok();

      case 'notEqual':
        return rule.value === value ? err(`Value must not be ${rule.value}.`) : ok();

      case 'notEmpty':
        return value === undefined || value === null ? err(`Value is empty`) : ok();

      case 'empty':
        return value !== undefined && value !== null ? err(`Value is not empty`) : ok();
    }
  };

  go: (value: unknown) => Result<boolean> = (value) => {
    const typeValidResult: (msg: string, opt: boolean) => Result<boolean> = (msg, opt) => {
      if (!opt) {
        return { ok: false, message: msg };
      } else {
        return { ok: true, value: true };
      }
    };
    if (value === null) {
      return typeValidResult('BooleanValidator expected a string but received null.', this._optional);
    } else if (value === undefined) {
      return typeValidResult('BooleanValidator expected a string but received undefined.', this._optional);
    } else if (typeof value !== 'boolean') {
      return typeValidResult(`BooleanValidator expected a string but received ${typeof value}.`, this._optional);
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
