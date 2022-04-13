import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalize'
})
export class NormalizePipe implements PipeTransform {

  transform(value: any): any {
    let img;
    if (!value) {
      return "";
    }
    img = value.replace(/\\/g, "/");
    return img;
  }

}
