import { Injectable } from '@angular/core';
import { WsService } from './ws.service';
import { Producto, Url } from '../pages/interfaces/producto-interface';
import { ImportlineProduct } from '../pages/interfaces/importline-interface';

@Injectable({
  providedIn: 'root'
})
export class ImportlineService {

  PRECIO_AJUSTE = 1.38;

  constructor(private wsService: WsService) { }

  getImportlineGetProductos(): Promise<any[]> {

    return new Promise( resolve => {
      this.wsService.getImportlineGetProductos().subscribe( data => {
        resolve( data.response );
      });
    });

  }

  transformImportlineData(): Promise<Producto[]> {

    return new Promise( resolve => {

      this.getImportlineGetProductos().then ( importlineResolve => {

        if (importlineResolve) {

          const detailsProducts: Producto[] = [];
          let id = 6000;

          importlineResolve.forEach( importProduct => {

            // Me traigo solo los productos que tienen existencias
            if ( importProduct.inventario.length > 0 && +importProduct.inventario[0].total > 0) {

              const urls: Url[] = [];

              importProduct.imagenes_colores.forEach( imagenes => {

                const url: Url = {
                  idImg: id,
                  idProducto: id,
                  url: imagenes.imagen_mediana
                };

                urls.push(url);

              });

              const producto: Producto = {

                idProducto: id,
                proveedor: 'Importline',
                sku: importProduct.clave,
                nombre: importProduct.descripcion,
                descripcion: importProduct.descripcion,
                precioActual: Number.parseFloat((+importProduct.precio * this.PRECIO_AJUSTE).toFixed(2)),
                cantidad: +importProduct.inventario[0].total,
                urls,
            };

              detailsProducts.push(producto);
              id++;

            }

          });

          resolve(detailsProducts);

        } else {
          console.log('Error: Importline');
          resolve( null );
        }

      });

    });
  }

}
