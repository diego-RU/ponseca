import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sol',
  standalone: true,
})
export class SolCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '';
    return `S/ ${value.toFixed(2)}`;
  }
}
