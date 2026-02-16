import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { EmployeesService, Employee } from '../../services/employees';
import { TurnsService, Turn } from '../../services/turns';
import { AuthService } from '../../services/auth';
import { CleanPhonePipe } from '../../pipes/clean-phone-pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSlideToggleModule,
    CleanPhonePipe, // ✅ importante para {{ e.phone | cleanPhone }}
  ],
})
export class Dashboard implements OnInit {
  loading = true;

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  visibleEmployees: Employee[] = [];

  turns: Turn[] = [];

  searchTerm = '';
  selectedCity = '';
  selectedStatus = '';
  sortOrder: 'AZ' | 'ZA' = 'AZ';

  cities: string[] = [];

  pageIndex = 0;
  pageSize = 8;

  constructor(
    private employeesService: EmployeesService,
    private turnsService: TurnsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.turns = this.turnsService.getAll().slice(0, 10);

    this.employeesService.getAll().subscribe({
      next: (list: Employee[]) => {
        this.employees = list;
        this.cities = Array.from(new Set(list.map(e => e.city).filter(Boolean))).sort();
        this.applyFilters(true);
        this.loading = false;
      },
      error: () => {
        this.employees = [];
        this.applyFilters(true);
        this.loading = false;
      },
    });
  }

  // ✅ COMPAT con tu HTML viejo
  get turnsLast10(): Turn[] {
    return this.turnsService.getAll().slice(0, 10);
  }

  // ✅ COMPAT con tu HTML viejo
  goAssignTurn(e: Employee): void {
    this.assignTurn(e);
  }

  // ✅ COMPAT con tu HTML viejo
  canAssign(e: Employee): boolean {
    return e.status === 'Activo';
  }

  applyFilters(resetPage = false): void {
    if (resetPage) this.pageIndex = 0;

    const term = this.searchTerm.trim().toLowerCase();

    let list = [...this.employees];

    if (term) {
      list = list.filter(e =>
        (e.name ?? '').toLowerCase().includes(term) ||
        (e.email ?? '').toLowerCase().includes(term) ||
        (e.companyName ?? '').toLowerCase().includes(term)
      );
    }

    if (this.selectedCity) list = list.filter(e => e.city === this.selectedCity);
    if (this.selectedStatus) list = list.filter(e => e.status === this.selectedStatus);

    list.sort((a, b) => {
      const A = (a.name ?? '').toLowerCase();
      const B = (b.name ?? '').toLowerCase();
      return this.sortOrder === 'AZ' ? A.localeCompare(B) : B.localeCompare(A);
    });

    this.filteredEmployees = list;
    this.updateVisibleEmployees();
  }

  updateVisibleEmployees(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.visibleEmployees = this.filteredEmployees.slice(start, end);
  }

  onPageChange(ev: PageEvent): void {
    this.pageIndex = ev.pageIndex;
    this.pageSize = ev.pageSize;
    this.updateVisibleEmployees();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCity = '';
    this.selectedStatus = '';
    this.sortOrder = 'AZ';
    this.applyFilters(true);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  assignTurn(e: Employee): void {
    if (e.status === 'Inactivo') return;
    this.router.navigate(['/asignar-turno', e.id]);
  }

  toggleEmployeeStatus(e: Employee, checked: boolean): void {
    e.status = checked ? 'Activo' : 'Inactivo';
    this.employeesService.setStatus(e.id, e.status);
    this.applyFilters(false);
  }

  deleteTurn(t: Turn): void {
    if (t.status === 'Eliminado') return;

    const reason = window.prompt('Motivo para eliminar el turno:');
    if (!reason || !reason.trim()) return;

    this.turnsService.deleteWithReason(t.id, reason.trim());
    this.turns = this.turnsService.getAll().slice(0, 10);
  }

  // ✅ Si tu HTML llama formatDateDMY(t.dateISO)
  formatDateDMY(dateISO: string): string {
    // dateISO = YYYY-MM-DD -> DD/MM/YYYY
    if (!dateISO) return '';
    const parts = dateISO.split('-');
    if (parts.length !== 3) return dateISO;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // ✅ Si tu HTML viejo llama formatTime12h(t.startHour, t.startMin, t.startMeridiem)
  // Mantengo firma para que no reviente, pero realmente tu Turn ahora trae startTime/endTime
  formatTime12h(hour?: number, min?: number, mer?: string): string {
    if (hour == null || min == null || !mer) return '';
    const mm = String(min).padStart(2, '0');
    return `${hour}:${mm} ${String(mer).toUpperCase()}`;
  }
}


