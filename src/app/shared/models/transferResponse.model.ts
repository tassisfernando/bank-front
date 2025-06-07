export interface TransferResponse {
  message: string;
  transactionId?: string;
  originAccount?: string;
  destinationAccount?: string;
  amount?: number;
  fee?: number;
}