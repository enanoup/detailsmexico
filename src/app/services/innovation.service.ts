import { Injectable } from '@angular/core';
import { WsService } from './ws.service';
import { InnovationProduct, InnovationExistencias } from '../pages/interfaces/innovation-interface';
import { Producto, Url, Categoria } from '../pages/interfaces/producto-interface';

@Injectable({
  providedIn: 'root'
})
export class InnovationService {

  innovationProducts: InnovationProduct[] = [];
  innovationExistencias: InnovationExistencias[] = [];
  PRECIO_AJUSTE = 1.38;

  constructor(private wsService: WsService) { }

  getInnovationGetProducts(): Promise<InnovationProduct[]> {

    return new Promise ( resolve => {

      this.wsService.getInnovationGetProducts().subscribe( data => {
        this.innovationProducts.push(...data);
        resolve(this.innovationProducts);
      });
    });

  }

  getInnovationExistencias(): Promise<InnovationExistencias[]> {

    return new Promise ( resolve => {

      this.wsService.getInnovationExistencias().subscribe( data => {
        this.innovationExistencias.push(...data);
        resolve(this.innovationExistencias);
      });
    });

  }


   construirInnovationProduct(): Promise<InnovationProduct[]> {

    return new Promise (async resolve => {

        await this.getInnovationExistencias();
        await this.getInnovationGetProducts().then( productResolve => {
          if(productResolve) {
        
            let result :InnovationExistencias[];

            productResolve.forEach( producto => {
                result = this.innovationExistencias.filter(prod => prod.idProducto === producto.idProducto);
                producto.existencias = result[0].existencias;
            });


          } else {
            console.log('Error al llamar al webservice Innovation');
          }

          // Ordenamos del mayor precio al menor
          resolve(productResolve.sort((a,b) => (a.precio < b.precio) ? 1 : -1)); 
        });
    });
  }


  transformInnovationData(): Promise<Producto[]> {

    return new Promise( resolve => {
      this.construirInnovationProduct().then( innovationResolve => {

        if (innovationResolve) {

          const detailsProducts: Producto[] = [];


          innovationResolve.forEach( innovationProduct => {

            if ( innovationProduct.existencias > 0 ) {

              const urls: Url[] = [];

              innovationProduct.images.forEach( imagen => {

                const url: Url = {
                  idImg: innovationProduct.idProducto,
                  idProducto: innovationProduct.idProducto,
                  url: imagen
                };

                urls.push(url);

              });

              const cats: Categoria[] = [{
                idCategoria: innovationProduct.idCategoria,
                descripcion: innovationProduct.categoria
              }];

              const producto: Producto = {

                idProducto: innovationProduct.idProducto,
                proveedor: 'Innovation',
                sku: innovationProduct.sku,
                nombre: innovationProduct.nombre,
                descripcion: innovationProduct.descripcion,
                masDescripcion: innovationProduct.metaDescripcion,
                precioActual: Number.parseFloat((innovationProduct.precio * this.PRECIO_AJUSTE).toFixed(2)),
                cantidad: +innovationProduct.existencias,
                categorias: cats,
                urls,
              };

              detailsProducts.push(producto);
            }

          });
          resolve(detailsProducts);
        } else {
          console.log('Error: Innovation');
          resolve(null);
        }
      });
    });

  } 

}
