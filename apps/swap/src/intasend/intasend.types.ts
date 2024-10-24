export enum MpesaTractactionState {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Retry = 'RETRY',
  Failed = 'FAILED',
  Complete = 'COMPLETE',
}

export interface MpesaInvoice {
  invoice_id: string;
  state: MpesaTractactionState;
  charges: string;
  net_amount: string;
  currency: string;
  value: string;
  account: string;
  api_ref: string;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface MpesaTransactionUpdate extends MpesaInvoice {
  failed_reason: string | null;
  failed_code: string | null;
  challenge: string;
}

export interface SendSTKPushResponse {
  id: string;
  invoice: MpesaInvoice;
  refundable: boolean;
  created_at: string;
  updated_at: string;
}
