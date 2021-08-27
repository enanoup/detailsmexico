import { Injectable } from '@angular/core';
import { WsService } from './ws.service';
import { PromolinePrice, PromolineActiveItem, PromolineProductSingle } from '../pages/interfaces/promoline-interface';
import { Producto, Url, Categoria, Subcategoria } from '../pages/interfaces/producto-interface';

@Injectable({
  providedIn: 'root'
})
export class PromolineService {

  promolineProductPrice: PromolinePrice[] = [];
  promolineActiveItems: PromolineActiveItem[] = [];
  promolineProducts: PromolineProductSingle[] = [];
  promolineActiveProducts: PromolineProductSingle[] = [];
  PRECIO_AJUSTE = 1.38;

  constructor(private wsService: WsService) { }

  // :::::::::::::::::::: PROMOLINE WS :::::::::::::::::::::::::::

/*
  getPromolineProductInfoSingle( clave: string) {
    this.wsService.getPromolineProductInfoSingle( clave ).subscribe( data => {
        this.promolineProducts.push(data);
    });
  }

  getPromolinePriceByItem( clave: string ): Observable<any> {
    return this.wsService.getPromolinePriceByItem( clave );
  }

   getPromolineActiveItems() {

    return new Promise ( resolve => {
      this.wsService.getPromolineActiveItems().subscribe( data => {
          this.promolineActiveItems = data;
          resolve(this.promolineActiveItems);
          // console.log(this.promolineActiveItems);
      });
    });
  }

*/

  getPromolineAllProducts(): Promise<PromolineProductSingle[]> {

    return new Promise( resolve => {
        this.wsService.getPromolineAllProducts().subscribe( data => {
            resolve (data);
        });
    });

  }

  getPromolineGetPrice() {

    return new Promise ( resolve => {
      this.wsService.getPromolineGetPrice().subscribe ( data => {
        this.promolineProductPrice.push(...data);
        resolve (this.promolineProductPrice);
      });
    });
  }

  construirPromolineProducts(): Promise<PromolineProductSingle[]> {

    return new Promise( resolve => {

       this.getPromolineGetPrice();
       this.getPromolineAllProducts().then( productResolve => {

          if (productResolve) {

            let result: PromolinePrice[];
            productResolve.forEach( producto => {
                result = this.promolineProductPrice
                              .filter( prod => prod.Producto === producto.Producto);
                producto.Precio = result[0].Precio;
            });
          } else {
            console.log('Error: Promoline');
          }
          resolve(productResolve);
      });
    });
  }

  transformPromolineData(): Promise<Producto[]> {

    return new Promise( resolve => {

      this.construirPromolineProducts().then( promolineResolve => {

        let id = 1;

        if ( promolineResolve ) {

          const detailsProductos: Producto[] = [];

          promolineResolve.forEach( promolineProducto => {

            // Solo si hay existencias
            if ( promolineProducto.Total > 0) {

              const imagenes: Url[] = [{
                idImg: id,
                idProducto: id,
                url: promolineProducto.Imagen
              }];

              const cats: Categoria[] = [{
                idCategoria: id,
                descripcion: promolineProducto.Categoria
              }];

              const subcats: Subcategoria[] = [{
                idCategoria: id,
                idSubcategoria: id,
                descripcion: promolineProducto.SubCategoria
              }];

              const producto: Producto = {
                idProducto: id,
                proveedor: 'Promoline',
                sku: promolineProducto.Producto,
                nombre: promolineProducto.Descripcion,
                descripcion: promolineProducto.Descripcion,
                precioActual: Number.parseFloat((promolineProducto.Precio * this.PRECIO_AJUSTE).toFixed(2)),
                cantidad: promolineProducto.Total,
                urls: imagenes,
                categorias: cats,
                subcategorias: subcats
              };

              detailsProductos.push(producto);
              id++;

            }

          });
          resolve(detailsProductos);
        } else {
          resolve ( null );
        }
      });
    });

  }

}
