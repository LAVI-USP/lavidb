import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
})
export class DatabaseRequestPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const sortedValues = value.sort((a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    return sortedValues;
  }
}
