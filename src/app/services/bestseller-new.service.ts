import { Injectable } from '@angular/core';
import { WsService } from './ws.service';
import { Producto } from '../pages/interfaces/producto-interface';

@Injectable({
  providedIn: 'root'
})
export class BestsellerNewService {

  PRECIO_AJUSTE = 1.38;

  constructor(private wsService: WsService) { }

  getBestSeller(): Promise<Producto[]> {

    return new Promise( resolve => {

      this.wsService.getProductosBestSeller().subscribe( bestSeller => {
        resolve( bestSeller );
      });
    });
  }

  getNew(): Promise<Producto[]> {
    return new Promise ( resolve => {

      this.wsService.getProductosNuevos().subscribe( nuevos => {
        resolve ( nuevos );
      });

    });
  }

  transformAllNewAndBestSeller(): Promise<Producto[]> {

    return new Promise( async resolve => {

      const productos: Producto[] = [];
      let id = 8000;

      await this.getBestSeller().then ( bestSeller => {
        if ( bestSeller ) {
          productos.push(...bestSeller);
        }
      });

      await this.getNew().then ( nuevos => {
        if ( nuevos ) {
          productos.push( ...nuevos );
        }
      });

      productos.forEach ( producto => {
        producto.idProducto = id;
        producto.precioActual = Number.parseFloat((producto.precioActual * this.PRECIO_AJUSTE).toFixed(2));
        id++;
      });

      resolve( productos );

    });
  }


}
