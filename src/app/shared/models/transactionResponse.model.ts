export interface TransactionResponse {
  transactionId: string;
  type?: string;
  newBalance?: number;
  message: string;
}