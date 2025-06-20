import { TransactionType } from "../enums/transactionType.enum";

export interface StatementResponse {
    dateTime: string;
    amount: number;
    type: TransactionType;
    operation: string;
    accountNumberOrigin: string;
    accountNumberDestin: string;
}