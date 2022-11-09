import { Builder, parseStringPromise } from 'xml2js';

import { businessOrder, PaymentData, _3dsOrder, adicionalOrder, urlOrder } from './models/Interfaces';
import { PaymentValidator } from './validators/PaymentValidator';
import { Result } from './validators/IValidator';
import { WppError } from './models/WppError';
import { AESHelper } from './util/AESHelper';
import { WppHttpHelper } from './util/WppHttpHelper';

export class WppClient {
  private builder = new Builder({
    renderOpts: {
      pretty: false,
    },
  });
  private httpHelper!: WppHttpHelper;
  private aesHelper!: AESHelper;

  /**
   * Constructor de la clase
   * @param endpoint URL al que se envia la solicitud de generacion de ligas.
   * @param id Identificador porporcionado por WebPay Plus
   * @param key Llave de cifrado en hex proporcionada por WebPay Plus.
   */
  constructor(endpoint: string, private id: string, key: string) {
    this.httpHelper = new WppHttpHelper(endpoint);
    this.aesHelper = new AESHelper(Buffer.from(key, 'hex'));
  }

  /**
   * Obtiene la liga de pagos con los datos proporcionados en payment.
   * @param payment Objeto con los datos a enviar a WebPay PLUS.
   * @returns Promesa de la que se puede recuperar la liga de pagos o los errores obtenidos.
   */
  public async getUrlPayment(payment: PaymentData): Promise<string> {
    this.validate(payment);
    this.sort(payment);

    const xml = this.buildRequest(payment);
    let paymentResponse: any = {};
    await this.sendRequest(xml)
      .then((res) => this.processAfterPaymentResponse(res))
      .then((res) => (paymentResponse = res))
      .catch((err) => {
        if( err.constructor.name === "WppError" ){
          throw err;
        }
        throw new WppError(err.message)
      });
    if ('success' !== paymentResponse?.cd_response) {
      throw new WppError(paymentResponse?.nb_response);
    }
    return paymentResponse?.nb_url;
  }

  /**
   * Verifica que el objeto cumpla con los requisitos necesarios para enviar al endpoint.
   * @param payment Objeto con los datos del pago
   */
  private validate(payment: PaymentData): void {
    const result: Result<PaymentData> = PaymentValidator.validate(payment);
    if (!result.ok) {
      throw new WppError(result.message);
    }
  }

  /**
   * Ordena los objetos para cumplir con la estructura especificada en el XML de solicitud
   * @param payment Objeto con los datos del pago
   * @returns El mismo objeto con los atributos ordenados.
   */
  private sort(payment: PaymentData) {
    payment.business = JSON.parse(JSON.stringify(payment.business, businessOrder));
    payment.url = JSON.parse(JSON.stringify(payment.url, urlOrder));
    if (payment.data3ds) {
      payment.data3ds = JSON.parse(JSON.stringify(payment.data3ds, _3dsOrder));
    }
    if (payment.datos_adicionales) {
      payment.datos_adicionales = JSON.parse(JSON.stringify(payment.datos_adicionales, adicionalOrder));
    }

    return (payment = JSON.parse(JSON.stringify(payment)));
  }

  /**
   * Construye la cadena cifrada que se envia al endpoint de WebPay Plus
   * @param payment Objeto con los datos del pago.
   * @returns Cadena XML que se enviara al generador de ligas.
   */
  private buildRequest(payment: PaymentData): string {
    const p = {
      P: payment,
    };
    let xml = this.builder.buildObject(p);
    xml = this.aesHelper.encrypt(xml);
    const pgs = {
      pgs: {
        data0: this.id,
        data: xml,
      },
    };
    xml = this.builder.buildObject(pgs);
    xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '');
    return xml;
  }

  /**
   *
   * @param xml Envia la peticion al endpoint proporcionado.
   * @returns Promesa con la respuesta del enpoint.
   */
  private async sendRequest(xml: string): Promise<string> {
    xml = `xml=${encodeURI(xml)}`;
    return this.httpHelper.post(xml);
  }

  /**
   * Valida si una cadena es Base64.
   * @param str cadena a validar
   * @returns true si es Base64; false en caso contrario
   */
  private isB64Encoded(str: string) {
    return Buffer.from(str, 'base64').toString('base64') === str;
  }

  /**
   * Descifra el resultado de un pago y lo convierte a un objeto JSON
   * @param response Mensaje cifrado del servidor
   * @returns JSON representativo del mensaje
   */
  public processAfterPaymentResponse(response: string): Promise<any> {
    if (response.includes('strResponse=')) {
      response = response.replace('strResponse=', '');
    }
    if(response.includes("%")){
      response = decodeURIComponent(response);
      response = response.replace(/[\r\n\s]/g, "");
    }
    if (!this.isB64Encoded(response)) {
      throw new WppError(response);
    }

    response = this.aesHelper.decrypt(response);

    return parseStringPromise(response, { trim: true, explicitArray: false, explicitRoot: false });
  }
}
