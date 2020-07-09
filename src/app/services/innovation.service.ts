import { Injectable } from '@angular/core';
import { WsService } from './ws.service';
import { InnovationProduct } from '../pages/interfaces/innovation-interface';
import { Producto, Url } from '../pages/interfaces/producto-interface';

@Injectable({
  providedIn: 'root'
})
export class InnovationService {

  innovationProducts: InnovationProduct[] = [];
  PRECIO_AJUSTE = 1.38;

  constructor(private wsService: WsService) { }

  getInnovationGetProducts(): Promise<InnovationProduct[]> {

    return new Promise ( resolve => {

      this.wsService.getInnovationGetProducts().subscribe( data => {
        resolve(data);
      });
    });

  }

  transformInnovationData(): Promise<Producto[]> {

    return new Promise( resolve => {
      this.getInnovationGetProducts().then( innovationResolve => {

        if (innovationResolve) {

          const detailsProducts: Producto[] = [];
          let id = 4000;

          innovationResolve.forEach( innovationProduct => {

            if ( +innovationProduct.can_1 > 0 ) {

              const urls: Url[] = [{
                idImg: id,
                idProducto: id,
                url: innovationProduct.imagen
              }];

              const producto: Producto = {

                idProducto: id,
                proveedor: 'Innovation',
                sku: innovationProduct.id,
                nombre: innovationProduct.descripcion,
                descripcion: innovationProduct.impresion,
                precioActual: Number.parseFloat((innovationProduct.precio_0 * this.PRECIO_AJUSTE).toFixed(2)),
                nuevoProducto: (innovationProduct.nuevo !== '0') ? true : false,
                cantidad: +innovationProduct.can_1,
                urls,
              };

              detailsProducts.push(producto);
              id++;
            }

          });
          console.log('Innovation Test: ', detailsProducts);
          resolve(detailsProducts);
        } else {
          console.log('Error: Innovation');
          resolve(null);
        }
      });
    });

  }

}
