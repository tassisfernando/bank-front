import { Routes } from '@angular/router';
import { Login } from './features/login/components/login';
import { RegisterCustomer } from './features/customers/components/register-customer/register-customer';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard';
import { AccountListComponent } from './features/accounts/components/account-list/account-list';
import { WithdrawComponent } from './features/transactions/components/withdraw/withdraw';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { DepositComponent } from './features/transactions/components/deposit/deposit';
import { StatementComponent } from './features/transactions/components/components/statement/statement';

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
        canActivate: [authGuard]
    },
    {
        path: 'accounts', 
        component: AccountListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'withdraw', 
        component: WithdrawComponent,
        canActivate: [authGuard]
    },
    {
        path: 'deposit', 
        component: DepositComponent,
        canActivate: [authGuard]
    },
    {
        path: 'statement', 
        component: StatementComponent,
        canActivate: [authGuard]
    },
];