export const businessOrder: string[] = ['id_company', 'id_branch', 'user', 'pwd'];
export interface BusinessData {
  id_company: string;
  id_branch: string;
  user: string;
  pwd: string;
}

export const urlOrder: string[] = [
  'reference',
  'amount',
  'moneda',
  'canal',
  'omitir_notif_default',
  'promociones',
  'id_promotion',
  'st_correo',
  'fh_vigencia',
  'mail_cliente',
  'prepago',
];
export interface UrlData {
  reference: string;
  amount: number;
  moneda: 'MXN' | 'USD';
  canal: 'W';
  omitir_notif_default: 0 | 1;
  promociones?: string;
  id_promotion?: string;
  st_correo?: 0 | 1;
  fh_vigencia?: string;
  mail_cliente?: string;
  prepago?: 0 | 1;
}

export const _3dsOrder: string[] = ['ml', 'cl', 'dir', 'cd', 'est', 'cp', 'idc'];
export interface Data3DSData {
  ml: string;
  cl: string;
  dir?: string;
  cd?: string;
  est?: string;
  cp?: string;
  idc?: string;
}

export const _atributoOrder: string[] = ['id', 'display'];
export interface AtributoData {
  id: number;
  display: boolean;
}

export interface DatoAdicionalData {
  $: AtributoData;
  label: string;
  value: string;
}

export const adicionalOrder: string[] = ['data', '$', 'id', 'display', 'label', 'value'];
export interface DatosAdicionales {
  data: DatoAdicionalData[];
}

export const paymentOrder: string[] = ['business', 'version', 'url', 'data3ds', 'datos_adicionales'];
export interface PaymentData {
  business: BusinessData;
  nb_fpago?: 'GPY' | 'APY' | 'C2P' | 'COD' | 'TCD' | 'BNPL';
  version: 'IntegraWPP';
  url: UrlData;
  data3ds?: Data3DSData;
  datos_adicionales?: DatosAdicionales;
}
