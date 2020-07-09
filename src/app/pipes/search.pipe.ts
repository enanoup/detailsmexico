import { Pipe, PipeTransform } from '@angular/core';
import { ProductoService } from '../services/producto.service';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  constructor( private productoService: ProductoService ) {}

  transform(value: any, args: any): any[] {

    const resultProductos = [];

    // Validamos. Por alguna razón hay un producto de los web services que traen un NULL
    args = (args != null) ? this.filtrar_acentos( args ) : '';

    for (const producto of value) {

       // Validamos. Por alguna razón hay un producto de los web services que traen un NULL
      const nombre = (producto.nombre != null) ? this.filtrar_acentos(producto.nombre) : '';
      const descripcion = (producto.descripcion) ? this.filtrar_acentos(producto.descripcion) : '';
      const sku = (producto.sku) ? this.filtrar_acentos(producto.sku) : '';

      if (nombre.indexOf(args) > -1 ||
          descripcion.indexOf(args) > -1 ||
            sku.indexOf(args) > -1 ) {

        resultProductos.push(producto);

      }
    }

    this.productoService.setPipeResults(resultProductos.length);

    return resultProductos;
  }

  filtrar_acentos(input: string) {

    if ( input != null) {
      const acentos =  'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç';
      const original = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc';

      for (let i = 0; i < acentos.length; i++) {
        input = input.replace(acentos.charAt(i), original.charAt(i)).toLowerCase();
      }
    }
    return input;
  }

}
