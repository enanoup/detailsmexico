import { Pipe, PipeTransform } from '@angular/core';
import { Url } from '../pages/interfaces/producto-interface';

@Pipe({
  name: 'productos'
})
export class SanitizerPipe implements PipeTransform {

  constructor() {}

  transform(urls: Url[]): string[] {

    const newUrls: string[] = [];
    let value = 0;

    for ( let i = 1 ; i < urls.length; i++) {
      newUrls[value] = urls[i].url;
      value++;
    }

    return newUrls;
  }

}
