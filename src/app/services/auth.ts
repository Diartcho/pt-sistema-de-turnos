import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(email: string, password: string): boolean {
    if (email === 'admin@test.com' && password === '123456') {
      localStorage.setItem('auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('auth');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('auth') === 'true';
  }
}
