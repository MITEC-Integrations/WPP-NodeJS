import { Data3DSData } from '../models/Interfaces';
import { ShapeValidator } from './ShapeValidator';
import { StringValidator } from './StringValidator';
import { Result } from './IValidator';

export class V3DSValidator {
  public static validator = new ShapeValidator<Data3DSData>(
    {
      ml: new StringValidator().notEmpty().minLength(1).maxLength(100),
      cl: new StringValidator().notEmpty().minLength(1).maxLength(20),
      dir: new StringValidator().maxLength(60),
      cd: new StringValidator().maxLength(30),
      est: new StringValidator().minLength(2).maxLength(2),
      cp: new StringValidator().maxLength(10),
      idc: new StringValidator().minLength(3).maxLength(3),
    },
    ['dir', 'cd', 'est', 'cp', 'idc'],
    true,
  );

  public static validate(_3dsData: Data3DSData): Result<Data3DSData> {
    if (!_3dsData) {
      return { ok: true, value: {} as Data3DSData };
    }
    return this.validator.go(_3dsData);
  }
}
