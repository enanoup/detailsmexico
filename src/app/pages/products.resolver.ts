import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { InnovationService } from '../services/innovation.service';
import { Producto } from './interfaces/producto-interface';
import { ProductoService } from '../services/producto.service';



@Injectable()
export class ProductResolver implements Resolve<any> {

    productosBestAndNew : Producto[] = [];
    productosDetails : Producto[] = [];
    load = false;

  constructor(private storageService: LocalStorageService,
                private innovationService: InnovationService,
                private productoService: ProductoService) {
  }

  async resolve(route: ActivatedRouteSnapshot) {

/* 
    Este componente mandará llamar a todos los WS de proveedores para guardar todo en el storage
    De este modo solo trabajaremos con el storage en ProductoService
*/
          // Verificamos que los productos no estén en el storage antes de cualquier cosa
          // llamamos Best and New porque es el que menos artículos tiene y es más rápido
           await this.storageService.getNewAndBestsellerProducts().then ( async productosBestNewEnStorage => {

                // Validamos si NO encontramos productos en el storage
                if(productosBestNewEnStorage == null || productosBestNewEnStorage == undefined
                  || productosBestNewEnStorage[0] == undefined || productosBestNewEnStorage[0] == null ) { 
                    
                    // No había productos por lo tanto los traemos del WS
                    await this.innovationService.transformInnovationData().then( innovationProducts => {
                        
                      if(innovationProducts.length > 0) {
                        this.productosDetails.push(...innovationProducts);
                      }      
                  });

                  // Aqui iría otra llamada a WS en caso de que se implemente algún otro.
                                  
                  /*
                  Ahora del total de productosDetails vamos a separar 20 aleatorios para Best and New
                  */    
                  if( this.productosDetails.length > 1 ) {
                    for (let i=0; i < 20; i++) {
                      const j = Math.floor(Math.random() * this.productosDetails.length-1);
                      this.productosBestAndNew.push(this.productosDetails[j]);
                  }
                }
                   // Finalmente guardamos todo en el storage
                   this.storageService.saveAllProducts(this.productosDetails);
                   this.storageService.saveNewAndBestSellerProducts(this.productosBestAndNew);
                } 
          // NO necestamos Else puesto que indicaría que los artículos ya estaban en el storage. 
          });

            // Aquí tenemos que poner una condicion para cada servicio

    if(route.params.sku) {
        
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

    } else {
        return true;
    }

    }

}
