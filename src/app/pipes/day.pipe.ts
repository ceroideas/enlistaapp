import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {

  transform(value: any): any {

    switch (value) {
      case '0':
        return 'Domingo';
        break;
      case '1':
        return 'Lunes';
        break;
      case '2':
        return 'Martes';
        break;
      case '3':
        return 'Miercoles';
        break;
      case '4':
        return 'Jueves';
        break;
      case '5':
        return 'Viernes';
        break;
      case '6':
        return 'Sábado';
        break;
    }
  }

}
