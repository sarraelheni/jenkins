import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { LoginComponent } from './pages/login/login';
import { ClientDashboardComponent } from './pages/client/dashboard/client-dashboard.component';
import { ClientClaimCreateComponent } from './pages/client/claims/claim-create/client-claim-create.component';
import { ClientClaimDetailsComponent } from './pages/client/claims/claim-details/client-claim-details.component';
import { AgentDashboardComponent } from './pages/agent/dashboard/agent-dashboard.component';
import { AgentClaimReviewComponent } from './pages/agent/claim-review/agent-claim-review.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'client',
    canActivate: [authGuard, roleGuard(['CLIENT'])],
    children: [
      { path: '', component: ClientDashboardComponent },
      { path: 'claims/new', component: ClientClaimCreateComponent },
      { path: 'claims/:id', component: ClientClaimDetailsComponent }, // ← added
    ],
  },

  {
    path: 'agent',
    canActivate: [authGuard, roleGuard(['AGENT'])],
    children: [
      { path: '', component: AgentDashboardComponent },
      { path: 'claims/:id/review', component: AgentClaimReviewComponent },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      { path: '', component: AdminDashboardComponent },
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
