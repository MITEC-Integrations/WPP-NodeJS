import { PaymentData } from '../models/Interfaces';
import { ShapeValidator } from './ShapeValidator';
import { StringValidator } from './StringValidator';
import { Result } from './IValidator';
import { UrlValidator } from './UrlValidator';
import { V3DSValidator } from './V3DSValidator';
import { DatoAdicionalValidator } from './DatoAdicionalValidator';
import { BusinessValidator } from './BusinessValidator';

export class PaymentValidator {
  public static validator = new ShapeValidator<PaymentData>(
    {
      business: BusinessValidator.validator,
      nb_fpago: new StringValidator().optional(true).exists(['GPY', 'APY', 'C2P', 'COD', 'TCD', 'BNPL']),
      version: new StringValidator().notEmpty().equals('IntegraWPP'),
      url: UrlValidator.validator,
      data3ds: V3DSValidator.validator,
      datos_adicionales: DatoAdicionalValidator.validator,
    },
    ['data3ds', 'datos_adicionales', 'nb_fpago'],
  );

  public static validate(payment: PaymentData): Result<PaymentData> {
    return this.validator.go(payment);
  }
}
