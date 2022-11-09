import { Builder } from './Builder';

export class B3dsBuilder<T extends Builder> implements Builder {
  private _3ds: any = {};

  constructor(private parent: T) {}

  build() {
    return this._3ds;
  }

  and(): T {
    return this.parent;
  }

  email(email: string): B3dsBuilder<T> {
    this._3ds.ml = email;
    return this;
  }

  phone(phone: string): B3dsBuilder<T> {
    this._3ds.cl = phone;
    return this;
  }

  address(address: string): B3dsBuilder<T> {
    this._3ds.dir = address;
    return this;
  }

  city(city: string): B3dsBuilder<T> {
    this._3ds.cd = city;
    return this;
  }

  state(state: string): B3dsBuilder<T> {
    this._3ds.est = state;
    return this;
  }

  zipCode(zipCode: string): B3dsBuilder<T> {
    this._3ds.cp = zipCode;
    return this;
  }

  isoCountry(isoCountryCode: string): B3dsBuilder<T> {
    this._3ds.idc = isoCountryCode;
    return this;
  }
}
