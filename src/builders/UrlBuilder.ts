import { Builder } from './Builder';

export class UrlBuilder<T extends Builder> implements Builder {
  private url: any = {
    canal: 'W',
  };

  constructor(private parent: T) {}

  build() {
    return this.url;
  }

  and(): T {
    return this.parent;
  }

  reference(reference: string): UrlBuilder<T> {
    this.url.reference = reference;
    return this;
  }

  amount(amount: number): UrlBuilder<T> {
    this.url.amount = amount;
    return this;
  }

  currency(currency: 'MXN' | 'USD'): UrlBuilder<T> {
    this.url.moneda = currency;
    return this;
  }

  omitNotification(omitiNotification: 0 | 1): UrlBuilder<T> {
    this.url.omitir_notif_default = omitiNotification;
    return this;
  }

  promotion(...promotions: string[]): UrlBuilder<T> {
    this.url.promociones = '';
    promotions.forEach((promo) => (this.url.promociones += promo + ','));
    return this;
  }

  idPromotion(idPromotion: string): UrlBuilder<T> {
    this.url.id_promotion = idPromotion;
    return this;
  }

  stEmail(stEmail: 0 | 1): UrlBuilder<T> {
    this.url.st_correo = stEmail;
    return this;
  }

  expirationDate(expirationDate: Date): UrlBuilder<T> {
    this.url.fhVigencia = expirationDate.toLocaleDateString('es_MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return this;
  }

  clientEmail(clientEmail: string): UrlBuilder<T> {
    this.url.mail_cliente = clientEmail;
    return this;
  }

  prepaid(prepaid: 0 | 1): UrlBuilder<T> {
    this.url.prepago = prepaid;
    return this;
  }
}
