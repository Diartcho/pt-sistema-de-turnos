import { Injectable } from '@angular/core';

export interface Turn {
  id: string;
  employeeId: number;
  employeeName: string;

  dateISO: string;      // YYYY-MM-DD
  startTime: string;    // "8:15 AM"
  endTime: string;      // "10:45 AM"

  cargo: string;

  status: 'Activo' | 'Eliminado';
  deletedReason?: string;
  deletedAtISO?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TurnsService {
  private readonly KEY = 'turns-v1';

  getAll(): Turn[] {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return [];
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  add(turn: Turn): void {
    const all = this.getAll();
    all.unshift(turn);
    localStorage.setItem(this.KEY, JSON.stringify(all));
  }

  deleteWithReason(turnId: string, reason: string): void {
    const all = this.getAll();
    const idx = all.findIndex(t => t.id === turnId);
    if (idx < 0) return;

    all[idx].status = 'Eliminado';
    all[idx].deletedReason = reason;
    all[idx].deletedAtISO = new Date().toISOString();

    localStorage.setItem(this.KEY, JSON.stringify(all));
  }
}
