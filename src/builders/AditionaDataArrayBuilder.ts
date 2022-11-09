import { DatosAdicionales, DatoAdicionalData } from '../models/Interfaces';
import { Builder } from './Builder';

export class AditionalDataArrayBuilder<T extends Builder> implements Builder {
  private aditionalDatas: DatosAdicionales = {
    data: [],
  };

  constructor(private parent: T) {}

  build(): any {
    this.aditionalDatas?.data?.sort((a: DatoAdicionalData, b: DatoAdicionalData) => {
      return a.$.id - b.$.id;
    });
    return this.aditionalDatas;
  }

  and(): T {
    return this.parent;
  }

  append(id: number, display: boolean, label: string, value: string): AditionalDataArrayBuilder<T> {
    const index = this.aditionalDatas.data.findIndex((item: DatoAdicionalData) => id === item?.$?.id);
    const addData: DatoAdicionalData = {
      $: { id, display },
      label,
      value,
    };
    if (index < 0) {
      this.aditionalDatas.data.push(addData);
    } else {
      this.aditionalDatas.data[index] = addData;
    }
    return this;
  }
}
