import { AtributoData, DatoAdicionalData, DatosAdicionales } from '../models/Interfaces';
import { ShapeValidator } from './ShapeValidator';
import { StringValidator } from './StringValidator';
import { Result } from './IValidator';
import { NumberValidator } from './NumberValidator';
import { ArrayValidator } from './ArrayValidator';
import { BooleanValidator } from './BooleanValidator';

export class DatoAdicionalValidator {
  // public static validator = new ShapeValidator<DatosAdicionales>({
  //     data : new ShapeValidator<DatoAdicionalData>({
  //         $ : new ShapeValidator<AtributoData>({
  //                     id : new NumberValidator().notEmpty(),
  //                     display: new StringValidator().notEmpty().exists(["true", "false"])
  //                 }),
  //                 label :  new StringValidator().notEmpty().minLength(1).maxLength(30),
  //                 value: new StringValidator().notEmpty().minLength(1).maxLength(100)
  //     })
  // }, [], true);

  public static validator = new ShapeValidator<DatosAdicionales>(
    {
      data: new ArrayValidator<DatoAdicionalData>({
        $: new ShapeValidator<AtributoData>({
          id: new NumberValidator().notEmpty(),
          display: new BooleanValidator().notEmpty(),
        }),
        label: new StringValidator().notEmpty().minLength(1).maxLength(30),
        value: new StringValidator().notEmpty().minLength(1).maxLength(100),
      }),
    },
    [],
    true,
  );

  public static validate(addData: DatosAdicionales): Result<DatosAdicionales> {
    return this.validator.go(addData);
  }
}
