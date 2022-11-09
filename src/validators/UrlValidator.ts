import { UrlData } from '../models/Interfaces';
import { ShapeValidator } from './ShapeValidator';
import { StringValidator } from './StringValidator';
import { Result } from './IValidator';
import { NumberValidator } from './NumberValidator';

export class UrlValidator {
  private static optionalFields: string[] = [
    'promociones',
    'id_promotion',
    'st_correo',
    'fh_vigencia',
    'mail_cliente',
    'prepago',
  ];

  public static validator = new ShapeValidator<UrlData>(
    {
      reference: new StringValidator().notEmpty().minLength(1).maxLength(50),
      amount: new NumberValidator().notEmpty().minLength(1).maxLength(11),
      moneda: new StringValidator().notEmpty().exists(['MXN', 'USD']),
      canal: new StringValidator().notEmpty().equals('W'),
      omitir_notif_default: new NumberValidator().exists([0, 1]),
      promociones: new StringValidator().optional(true).maxLength(40),
      id_promotion: new StringValidator().optional(true).maxLength(12),
      st_correo: new NumberValidator().optional(true).exists([0, 1]),
      fh_vigencia: new StringValidator().optional(true).minLength(10).maxLength(14),
      mail_cliente: new StringValidator().optional(true).maxLength(100),
      prepago: new NumberValidator().optional(true).exists([0, 1]),
    },
    this.optionalFields,
  );

  public static validate(url: UrlData): Result<UrlData> {
    return this.validator.go(url);
  }
}
