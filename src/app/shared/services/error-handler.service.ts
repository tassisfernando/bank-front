import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  constructor() {}

  handleHttpError(error: any): string {
    if (error.status === 409) {
      return 'CPF já cadastrado no sistema';
    } else if (error.status === 400) {
      return 'Dados inválidos. Verifique as informações fornecidas';
    } else if (error.status === 401) {
      return 'CPF ou senha incorretos';
    } else if (error.status === 403) {
      return 'Acesso negado';
    } else if (error.status === 404) {
      return 'Recurso não encontrado';
    } else if (error.status === 0 || error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde';
    } else {
      return 'Erro inesperado. Tente novamente';
    }
  }

  handleAuthError(error: any): string {
    if (error.status === 401) {
      return 'CPF ou senha incorretos';
    } else if (error.status === 403) {
      return 'Acesso negado';
    } else if (error.status === 0 || error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde';
    } else {
      return 'Erro ao fazer login. Tente novamente';
    }
  }

  handleRegistrationError(error: any): string {
    if (error.status === 409) {
      return 'CPF já cadastrado no sistema';
    } else if (error.status === 400) {
      return 'Dados inválidos. Verifique as informações fornecidas';
    } else if (error.status === 0 || error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde';
    } else {
      return 'Erro ao criar conta. Tente novamente';
    }
  }

  handleTransactionError(error: any): string {
    if (error.status === 400) {
      return 'Dados da transação inválidos';
    } else if (error.status === 403) {
      return 'Transação não autorizada';
    } else if (error.status === 422) {
      return 'Saldo insuficiente ou conta inválida';
    } else if (error.status === 0 || error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde';
    } else {
      return 'Erro ao processar transação. Tente novamente';
    }
  }

  handleAccountError(error: any): string {
    if (error.status === 403) {
      return 'Acesso negado às informações da conta';
    } else if (error.status === 404) {
      return 'Nenhuma conta encontrada';
    } else if (error.status === 0 || error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde';
    } else {
      return 'Erro ao carregar contas. Tente novamente';
    }
  }

  handleStatementError(error: any): string {
    if (error.status === 404) {
      return 'Nenhuma transação encontrada para esta conta';
    } else if (error.status === 403) {
      return 'Acesso negado às informações de extrato';
    } else if (error.status === 0 || error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde';
    } else {
      return 'Erro ao carregar extrato. Tente novamente';
    }
  }
}