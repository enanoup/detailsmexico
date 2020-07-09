import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Producto } from './interfaces/producto-interface';
import { ProductoService } from '../services/producto.service';

@Injectable()
export class UserProductoResolve implements Resolve<Producto> {

  constructor(private productoService: ProductoService) {}

  async resolve(route: ActivatedRouteSnapshot) {

    // Aquí tenemos que poner una condicion para cada servicio

    let producto = null;
    // Primero verifica si el SKU pertenece a la vitrina
    producto = await this.productoService.getNewAndBestsellerBySku(route.params.sku);

    // Si no encontró nada en la vitrina entonces buscará en el catálogo de productos. 
    if ( !producto ) {
      /* Aquí va a llamar a un sevicio que conecta con el JSON que ya tiene 
      todos los productos desde antes y que guarda en el storage */
      producto = await this.productoService.getProductoBySKU(route.params.sku);

      /* También tengo que cargar los productos si es que no estan cargados
      De este modo si se comparte un link a alguien
      */
    }

    // Condicion si el SKU proviene de INNOVATION para llamar al web service

    return producto;
  }
}
