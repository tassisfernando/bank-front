export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export function getTransactionTypeDescription(type: TransactionType): string {
  switch (type) {
    case TransactionType.CREDIT:
      return 'Crédito';
    case TransactionType.DEBIT:
      return 'Débito';
    default:
      return 'N/A';
  }
}

// Função auxiliar para traduzir strings do backend
export function translateTransactionType(type: string): string {
  if (!type) return 'N/A';
  
  const normalizedType = type.trim().toUpperCase();
  
  switch (normalizedType) {
    case 'CREDIT':
    case 'CREDITO':
    case 'C':
      return 'Crédito';
    case 'DEBIT':
    case 'DEBITO':
    case 'D':
      return 'Débito';
    default:
      return type; // Retorna original se não reconhecer
  }
}