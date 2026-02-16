import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, tap } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  companyName: string;
  status: 'Activo' | 'Inactivo';
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private readonly API = 'https://jsonplaceholder.typicode.com/users';
  private readonly CACHE_KEY = 'employees-cache-v1';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        const parsed: Employee[] = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return of(parsed);
      } catch {}
    }

    return this.http.get<any[]>(this.API).pipe(
      map((rows) => (rows ?? []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        city: u.address?.city ?? '',
        companyName: u.company?.name ?? '',
        status: 'Activo' as const, // por defecto Activo
      } as Employee))),
      tap(list => localStorage.setItem(this.CACHE_KEY, JSON.stringify(list))),
      catchError((err) => {
        console.error('Error cargando empleados:', err);
        return of([] as Employee[]);
      })
    );
  }

  setStatus(employeeId: number, status: 'Activo' | 'Inactivo'): void {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (!cached) return;

    try {
      const list: Employee[] = JSON.parse(cached);
      const idx = list.findIndex(e => e.id === employeeId);
      if (idx >= 0) {
        list[idx].status = status;
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(list));
      }
    } catch {}
  }
}

