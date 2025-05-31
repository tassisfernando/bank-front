import { Routes } from '@angular/router';
import { Login } from './features/login/components/login';
import { RegisterCustomer } from './features/customers/components/register-customer/register-customer';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '', 
        component: Login,
        canActivate: [guestGuard]
    },
    {
        path: 'register', 
        component: RegisterCustomer,
        canActivate: [guestGuard]
    },
    {
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [authGuard]  // Protege a rota do dashboard
    }
];