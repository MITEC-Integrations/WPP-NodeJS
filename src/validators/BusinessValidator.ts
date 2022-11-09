import { BusinessData } from '../models/Interfaces';
import { ShapeValidator } from './ShapeValidator';
import { StringValidator } from './StringValidator';
import { Result } from './IValidator';

export class BusinessValidator {
  public static validator = new ShapeValidator<BusinessData>({
    id_company: new StringValidator().notEmpty().minLength(4).maxLength(4),
    id_branch: new StringValidator().notEmpty().minLength(1).maxLength(11),
    user: new StringValidator().notEmpty().minLength(9).maxLength(11),
    pwd: new StringValidator().notEmpty().minLength(1).maxLength(80),
  });

  public static validate(business: BusinessData): Result<BusinessData> {
    return this.validator.go(business);
  }
}
