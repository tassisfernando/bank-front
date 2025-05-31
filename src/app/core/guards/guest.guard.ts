import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/login/services/auth.service';

export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Se estiver logado, redireciona para dashboard
    router.navigate(['/dashboard']);
    return false;
  }
  
  // Se não estiver logado, permite acesso
  return true;
};