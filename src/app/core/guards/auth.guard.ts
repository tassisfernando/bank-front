import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/login/services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Se estiver logado, permite acesso
    return true;
  }
  
  // Se não estiver logado, redireciona para login
  router.navigate(['']);
  return false;
};