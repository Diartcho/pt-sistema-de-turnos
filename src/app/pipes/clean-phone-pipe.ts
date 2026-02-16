import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanPhone',
  standalone: true,
})
export class CleanPhonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    // deja solo números y algunos símbolos básicos
    const cleaned = String(value).replace(/[^\d+]/g, '');
    return cleaned;
  }
}
