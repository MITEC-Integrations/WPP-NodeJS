import { Builder } from './Builder';

export class BusinessBuilder<T extends Builder> implements Builder {
  private business: any = {};

  constructor(private parent: T) {}

  build() {
    return this.business;
  }

  and() {
    return this.parent;
  }

  idCompany(idCompany: string): BusinessBuilder<T> {
    this.business.id_company = idCompany;
    return this;
  }

  idBranch(idBranch: string): BusinessBuilder<T> {
    this.business.id_branch = idBranch;
    return this;
  }

  user(user: string): BusinessBuilder<T> {
    this.business.user = user;
    return this;
  }

  password(password: string): BusinessBuilder<T> {
    this.business.pwd = password;
    return this;
  }
}
