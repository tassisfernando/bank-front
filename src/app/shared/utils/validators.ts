export function cpfIsValid(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
  if (firstCheck !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
  if (secondCheck !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export function maskPhone(phone: string): string {
  let value = phone.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 0) {
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    if (value.length > 10) {
      value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
    } else if (value.length > 9) {
      value = value.replace(/(\d{4})(\d{4})$/, '$1-$2');
    }
  }
  return value;
}