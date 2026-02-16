import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { AsignarTurno } from './pages/asignar-turno/asignar-turno';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  { path: 'empleados', component: Dashboard, canActivate: [authGuard] },

  // ✅ ESTA ES LA CLAVE: proteger asignar-turno también
  { path: 'asignar-turno/:id', component: AsignarTurno, canActivate: [authGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
