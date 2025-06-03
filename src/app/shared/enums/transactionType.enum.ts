export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

// Função helper para obter a descrição
export function getTransactionTypeDescription(type: TransactionType): string {
  switch (type) {
    case TransactionType.CREDIT:
      return 'Depósito';
    case TransactionType.DEBIT:
      return 'Saque';
    default:
      return 'Desconhecido';
  }
}