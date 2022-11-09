import { PaymentData } from '../models/Interfaces';
import { BusinessBuilder } from './BusinessBuilder';
import { UrlBuilder } from './UrlBuilder';
import { B3dsBuilder } from './B3dsBuilder';
import { Builder } from './Builder';
import { AditionalDataArrayBuilder } from './AditionaDataArrayBuilder';

export class PaymentBuilder implements Builder {
  private businessBuilder!: BusinessBuilder<PaymentBuilder>;
  private urlBuilder!: UrlBuilder<PaymentBuilder>;
  private b3dsBuilder!: B3dsBuilder<PaymentBuilder>;
  private addDataArray!: AditionalDataArrayBuilder<PaymentBuilder>;

  private payment: any = {
    version: 'IntegraWPP',
  };

  build() {
    if (this.businessBuilder) {
      this.payment.business = this.businessBuilder.build();
    }

    if (this.urlBuilder) {
      this.payment.url = this.urlBuilder.build();
    }

    if (this.b3dsBuilder) {
      this.payment.data3ds = this.b3dsBuilder.build();
    }

    if (this.addDataArray) {
      this.payment.datos_adicionales = this.addDataArray.build();
    }

    return this.payment;
  }

  paymentMethod(method: 'GPY' | 'APY' | 'C2P' | 'COD' | 'TCD' | 'BNPL'): PaymentBuilder {
    this.payment.nb_fpago = method;
    return this;
  }

  withBusiness(): BusinessBuilder<PaymentBuilder> {
    if (!this.businessBuilder) {
      this.businessBuilder = new BusinessBuilder(this);
    }
    return this.businessBuilder;
  }

  withUrl(): UrlBuilder<PaymentBuilder> {
    if (!this.urlBuilder) {
      this.urlBuilder = new UrlBuilder(this);
    }
    return this.urlBuilder;
  }

  withData3ds(): B3dsBuilder<PaymentBuilder> {
    if (!this.b3dsBuilder) {
      this.b3dsBuilder = new B3dsBuilder(this);
    }
    return this.b3dsBuilder;
  }

  withAditionalData(): AditionalDataArrayBuilder<PaymentBuilder> {
    if (!this.addDataArray) {
      this.addDataArray = new AditionalDataArrayBuilder(this);
    }
    return this.addDataArray;
  }
}
