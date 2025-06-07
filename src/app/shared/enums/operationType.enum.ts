export enum OperationType {
  DEPOSIT = 'Depósito',
  WITHDRAW = 'Saque', 
  BONUS = 'Bônus',
  FEE = 'Taxa',
  TRANSFER = 'Transferência'
}

export function translateOperation(operation: string): string {
  const translations: { [key: string]: string } = {
    'DEPOSIT': 'Depósito',
    'WITHDRAW': 'Saque',
    'WITHDRAWAL': 'Saque',
    'BONUS': 'Bônus',
    'FEE': 'Taxa',
    'TRANSFER': 'Transferência',
    'TRANSFERENCIA': 'Transferência',
    // Adicione outras traduções conforme necessário
    'deposit': 'Depósito',
    'withdraw': 'Saque',
    'withdrawal': 'Saque',
    'bonus': 'Bônus',
    'fee': 'Taxa',
    'transfer': 'Transferência'
  };
  
  return translations[operation] || operation;
}

export function getOperationTypeClass(operation: string): string {
  const translatedOperation = translateOperation(operation).toLowerCase();
  
  switch (translatedOperation) {
    case 'depósito':
      return 'operation-deposit';
    case 'saque':
      return 'operation-withdraw';
    case 'bônus':
      return 'operation-bonus';
    case 'taxa':
      return 'operation-fee';
    case 'transferência':
      return 'operation-transfer';
    default:
      return 'operation-default';
  }
}