import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';

import { TurnsService, Turn } from '../../services/turns';

export interface AssignTurnDialogData {
  employeeId: number;
  employeeName: string;
  employeeStatus?: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-assign-turn-dialog',
  standalone: true,
  templateUrl: './assign-turn-dialog.html',
  styleUrl: './assign-turn-dialog.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
})
export class AssignTurnDialog {
  form!: FormGroup;

  timeOptions: string[] = [];
  timeError = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private turnsService: TurnsService,
    private dialogRef: MatDialogRef<AssignTurnDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AssignTurnDialogData
  ) {
    this.form = this.fb.group({
      date: [null as Date | null, [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      cargo: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.timeOptions = this.buildTimeOptions15Min();
  }

  get f() {
    return (this.form as any).controls as { [key: string]: any };
  }

  close(): void {
    this.dialogRef.close(false);
  }

  private buildTimeOptions15Min(): string[] {
    const out: string[] = [];
    const minutes = [0, 15, 30, 45];
    for (const mer of ['AM', 'PM'] as const) {
      for (let h = 1; h <= 12; h++) {
        for (const m of minutes) {
          out.push(`${h}:${String(m).padStart(2, '0')} ${mer}`);
        }
      }
    }
    return out;
  }

  private dateToISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseTimeToMinutes12h(value: string): number | null {
    const v = (value || '').trim().toUpperCase();
    const match = v.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
    if (!match) return null;

    const hour = Number(match[1]);
    const min = Number(match[2]);
    const mer = match[3] as 'AM' | 'PM';

    if (hour < 1 || hour > 12) return null;
    if (min < 0 || min > 59) return null;
    if (![0, 15, 30, 45].includes(min)) return null;

    let h = hour % 12;
    if (mer === 'PM') h += 12;
    return h * 60 + min;
  }

  private validateTimes(): boolean {
    this.timeError = '';

    const startStr = this.f['startTime'].value;
    const endStr = this.f['endTime'].value;

    const start = this.parseTimeToMinutes12h(startStr);
    const end = this.parseTimeToMinutes12h(endStr);

    if (start == null) {
      this.timeError = 'Hora inicio inválida. Ej: 8:15 AM (minutos 00, 15, 30, 45).';
      return false;
    }
    if (end == null) {
      this.timeError = 'Hora fin inválida. Ej: 10:30 AM (minutos 00, 15, 30, 45).';
      return false;
    }
    if (end <= start) {
      this.timeError = 'La hora de fin debe ser mayor a la hora de inicio.';
      return false;
    }
    return true;
  }

  save(): void {
    this.successMsg = '';
    this.timeError = '';

    if (this.data.employeeStatus === 'Inactivo') {
      this.timeError = 'No se puede asignar turno a un empleado inactivo.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.validateTimes()) return;

    const date: Date = this.f['date'].value;
    const dateISO = this.dateToISO(date);

    const turn: Turn = {
      id: crypto.randomUUID(),
      employeeId: this.data.employeeId,
      employeeName: this.data.employeeName,
      dateISO,
      startTime: this.f['startTime'].value.trim(),
      endTime: this.f['endTime'].value.trim(),
      cargo: this.f['cargo'].value.trim(),
      status: 'Activo',
    };

    this.turnsService.add(turn);
    this.successMsg = '✅ Turno guardado correctamente.';

    setTimeout(() => this.dialogRef.close(true), 500);
  }
}




