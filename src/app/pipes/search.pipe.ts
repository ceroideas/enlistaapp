import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, query: any, type = 'name'): any {
      if(!query)return value;

      if (type == 'reservation') {
        return value.filter((item)=>{
          return JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
        });
      }
      return value.filter((item)=>{
        return JSON.stringify(item[type]).toLowerCase().includes(query.toLowerCase());
      });
  }

}
