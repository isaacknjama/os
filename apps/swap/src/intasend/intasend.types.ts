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
  api_ref: string;
  value: string;
  charges: string;
  net_amount: string;
  currency: string;
  account: string;
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
  state: MpesaTractactionState;
  refundable: boolean;
  created_at: string;
  updated_at: string;
}

export interface MpesaTxTracker {
  id: string;
  state: MpesaTractactionState;
}
