import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../pages/interfaces/producto-interface';
import { InnovationService } from './innovation.service';
import { LocalStorageService } from './local-storage.service';
import { BestsellerNewService } from './bestseller-new.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  bestAndNewProducts: Producto[] = [];
  detailsProducts: Producto[] = [];
  producto: Producto = null;
  pipeResults = 0;

  private productosJSON = '../assets/json/productos.json';


  constructor(  private http: HttpClient,
                //private promolineService: PromolineService,
                private innovationService: InnovationService,
                //private importlineService: ImportlineService,
                private storageService: LocalStorageService,
                private bestService: BestsellerNewService) { }

  getProductosPrueba(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productosJSON);
  }

   getProductoBySKU( sku: string) {

    return new Promise<Producto>( async resolve => {

      let productoResult: Producto[] = [];
      if ( this.detailsProducts.length < 1 ) {
          this.detailsProducts = await this.storageService.getAllProducts();
      }

      productoResult = this.detailsProducts.filter(
          producto => producto.sku.trim() === sku.trim()
      );

      resolve(productoResult[0]);
    });
  }

  getNewAndBestsellerBySku( sku: string) {

    return new Promise<Producto>( async resolve => {

      let productoResult: Producto[] = [];

      if ( this.bestAndNewProducts.length < 1 ) {
          this.bestAndNewProducts = await this.storageService.getNewAndBestsellerProducts();
      }

      if (this.bestAndNewProducts != null) {
        productoResult = this.bestAndNewProducts.filter(
          producto => producto.sku.trim() === sku.trim()
        );
      }

      resolve(productoResult[0]);
    });
  }

  setPipeResults( results: number) {
    this.pipeResults = results;
  }

  getPipeResults() {
    return this.pipeResults; // Of lo convierte en observable
  }

/*
   ///////// A partir de aquí es donde se ocnstruye el objeto //////////
*/

public getAllDetailProducts(): Promise<Producto[]> {

  return new Promise ( resolve => {
    
      // Primero llamamos a la función que nos dice si hay productos o no en el storage
      this.callProductsFromStorage().then( booleanStorageResolve => {

        // verificamos true o false
        if (booleanStorageResolve) {
          resolve( this.detailsProducts );
        // Si no hay en el storage llamamos a los webservices
        } else {
          this.callWebservices().then (webServiceResolve => {
            if ( webServiceResolve ) {
              resolve( this.detailsProducts );
            }
          });
        }
      });

  // Primero es necesario que carguen los productos para de ahí generar los Best and New aleatorios
  this.getNewAndBestsellerProducts();



  });
}

public getNewAndBestsellerProducts(): Promise<Producto[]> {

  return new Promise ( resolve => {

      // Primero llamamos a la función que nos dice si hay productos o no en el storage
      this.callBestAndNewFromStorage().then( productsFromStorageResolve => {
        // verificamos true o false
        if (productsFromStorageResolve) {
          resolve( this.bestAndNewProducts );
        // Si no hay en el storage llamamos a los webservices
        } else {
          this.getBestAndNewProducts(this.detailsProducts);
        }
      });
  });
}

public callProductsFromStorage(): Promise<boolean> {

  return new Promise( async resolve => {

      await this.storageService.getAllProducts().then ( storageResolve => {

        // verificamos que haya productos en el storage
        if (storageResolve && storageResolve.length > 0) {
          this.detailsProducts = storageResolve;
          resolve( true );
        // Si no hubo productos en el storage entonces avisamos false
        } else {
          resolve ( false );
        }
      });

  });

}

public callBestAndNewFromStorage(): Promise<boolean> {

  return new Promise( async resolve => {
  
       // verificamos que haya productos en el storage
      await this.storageService.getNewAndBestsellerProducts().then( storageResolve => {

        if (storageResolve && storageResolve.length > 0) {
          this.bestAndNewProducts = storageResolve;
          resolve( true );
        // Si no hubo productos en el storage entonces avisamos false
        } else {
          resolve ( false );
        }
      });

  });

}

public getBestAndNewProducts(productos:Producto[]) {
  
// Iteramos los productos y elegimos 20 aleatoreos para BestSeller y New

    for (let i=0; i < 20; i++) {
      const j = Math.floor(Math.random() * productos.length-1);
      this.bestAndNewProducts.push(productos[j]);
    }
    
    // Una vez que obtenemos los Best an New, guardamos en el storage
    this.storageService.saveNewAndBestSellerProducts(this.bestAndNewProducts);

}

public callWebservices(): Promise<boolean> {

  return new Promise ( async resolve => {

    // Nos traemos todos los productos de los WS
    
    await this.innovationService.transformInnovationData().then (data => {
      if(data != null) {
        this.detailsProducts.push (...data);   
      }
      this.getBestAndNewProducts(data);
    })
  
    this.storageService.saveAllProducts(this.detailsProducts);

    resolve (true);
  });

}

  callBestAndNewProducts(): Promise<boolean> {
    return new Promise( async resolve => {
      this.getBestAndNewProducts(this.bestAndNewProducts);
      resolve( true );
    });
  }


  /*

    AQUI ES DONDE SE CALCULA EL CRITERIO DE DESCUENTOS BASADOS EN LA TABLA DE EXCEL

  */

// Obtenemos el descuento total y aplicamos la fórmula
 getDescuento(cantidad: number, precio: number): Promise<number> {

  return new Promise( resolve => {

    this.calcularDescuento(cantidad, precio).then( descResolve => {

      if ( descResolve ) {
        resolve(descResolve);
      } else {
        resolve(1);
      }

    });
  });
}

 /*

 Segun la solicitud o cantidad de artículos definimos en que columna
 de la tabla de criterios nos encontramos para después calcula el
 porcentaje de descuento

 */

private calcularDescuento(solicitud: number, precio: number): Promise<number> {

  return new Promise( async resolve => {

    let value = 0;

    switch (true) {
    case solicitud > 1 && solicitud <= 20:
    value = await this.getPorcentajeDescuento(precio, 1);
    break;
    case solicitud > 20 && solicitud <= 50:
    value = await this.getPorcentajeDescuento(precio, 2);
    break;
    case solicitud > 50 && solicitud <= 100:
    value = await this.getPorcentajeDescuento(precio, 3);
    break;
    case solicitud > 100 && solicitud <= 200:
    value = await this.getPorcentajeDescuento(precio, 4);
    break;
    case solicitud > 200 && solicitud <= 400:
    value = await this.getPorcentajeDescuento(precio, 5);
    break;
    case solicitud > 400 && solicitud <= 600:
    value = await this.getPorcentajeDescuento(precio, 6);
    break;
    case solicitud > 600 && solicitud <= 800:
    value = await this.getPorcentajeDescuento(precio, 7);
    break;
    case solicitud > 800 && solicitud <= 1000:
    value = await this.getPorcentajeDescuento(precio, 8);
    break;
    case solicitud > 1000 && solicitud <= 5000:
    value = await this.getPorcentajeDescuento(precio, 9);
    break;
    case solicitud > 5000:
    value = await this.getPorcentajeDescuento(precio, 10);
    break;
    default:
      break;
  }

    resolve (value);

  });
}

// Aqui evaluamos la columna y según el rango de precio del artículo determinamos el % de descuento
private getPorcentajeDescuento(precio: number, columna: number): Promise<number> {


  return new Promise ( resolve => {
    let porcentaje = 0;
    const factor = 1;

    switch (columna) {

    case 1:

      switch (true) {
        case precio >= 1 && precio <= 59:
          porcentaje = 0.34;
          break;
        case precio >= 60 && precio <= 299:
          porcentaje = 0.33;
          break;
        case precio >= 300 && precio <= 699:
          porcentaje = 0.32;
          break;
        case precio >= 700 && precio <= 1000:
          porcentaje = 0.30;
          break;
        case precio > 1000:
          porcentaje = 0.28;
          break;
        default:
          break;
      }

      break;

    case 2:

      switch (true) {
        case precio >= 1 && precio <= 59:
          porcentaje = 0.33;
          break;
        case precio >= 60 && precio <= 299:
          porcentaje = 0.32;
          break;
        case precio >= 300 && precio <= 699:
          porcentaje = 0.31;
          break;
        case precio >= 700 && precio <= 1000:
          porcentaje = 0.29;
          break;
        case precio > 1000:
          porcentaje = 0.27;
          break;
        default:
          break;
      }

      break;

    case 3:

      switch (true) {
        case precio >= 1 && precio <= 59:
          porcentaje = 0.32;
          break;
        case precio >= 60 && precio <= 299:
          porcentaje = 0.31;
          break;
        case precio >= 300 && precio <= 699:
          porcentaje = 0.30;
          break;
        case precio >= 700 && precio <= 1000:
          porcentaje = 0.28;
          break;
        case precio > 1000:
          porcentaje = 0.26;
          break;
        default:
          break;
      }

      break;

      case 4:

      switch (true) {
        case precio >= 1 && precio <= 59:
          porcentaje = 0.31;
          break;
        case precio >= 60 && precio <= 299:
          porcentaje = 0.30;
          break;
        case precio >= 300 && precio <= 699:
          porcentaje = 0.29;
          break;
        case precio >= 700 && precio <= 1000:
          porcentaje = 0.27;
          break;
        case precio > 1000:
          porcentaje = 0.25;
          break;
        default:
          break;
      }

      break;

      case 5:

      switch (true) {
        case precio >= 1 && precio <= 59:
          porcentaje = 0.30;
          break;
        case precio >= 60 && precio <= 299:
          porcentaje = 0.28;
          break;
        case precio >= 300 && precio <= 699:
          porcentaje = 0.27;
          break;
        case precio >= 700 && precio <= 1000:
          porcentaje = 0.25;
          break;
        case precio > 1000:
          porcentaje = 0.23;
          break;
        default:
          break;
      }

      break;

      case 6:

          switch (true) {
            case precio >= 1 && precio <= 59:
              porcentaje = 0.28;
              break;
            case precio >= 60 && precio <= 299:
              porcentaje = 0.26;
              break;
            case precio >= 300 && precio <= 699:
              porcentaje = 0.25;
              break;
            case precio >= 700 && precio <= 1000:
              porcentaje = 0.23;
              break;
            case precio > 1000:
              porcentaje = 0.21;
              break;
            default:
              break;
          }

          break;

      case 7:

        switch (true) {
          case precio >= 1 && precio <= 59:
                  porcentaje = 0.26;
                  break;
                case precio >= 60 && precio <= 299:
                  porcentaje = 0.24;
                  break;
                case precio >= 300 && precio <= 699:
                  porcentaje = 0.23;
                  break;
                case precio >= 700 && precio <= 1000:
                  porcentaje = 0.21;
                  break;
                case precio > 1000:
                  porcentaje = 0.19;
                  break;
                default:
                  break;
              }

        break;

      case 8:

        switch (true) {
          case precio >= 1 && precio <= 59:
            porcentaje = 0.24;
            break;
          case precio >= 60 && precio <= 299:
            porcentaje = 0.22;
            break;
          case precio >= 300 && precio <= 699:
            porcentaje = 0.21;
            break;
          case precio >= 700 && precio <= 1000:
            porcentaje = 0.19;
            break;
          case precio > 1000:
            porcentaje = 0.17;
            break;
          default:
            break;
        }

        break;

        case 9:

          switch (true) {
            case precio >= 1 && precio <= 59:
              porcentaje = 0.22;
              break;
            case precio >= 60 && precio <= 299:
              porcentaje = 0.20;
              break;
            case precio >= 300 && precio <= 699:
              porcentaje = 0.19;
              break;
            case precio >= 700 && precio <= 1000:
              porcentaje = 0.17;
              break;
            case precio > 1000:
              porcentaje = 0.16;
              break;
              default:
              break;
            }

          break;

        case 10:

           switch (true) {
              case precio >= 1 && precio <= 59:
                porcentaje = 0.20;
                break;
              case precio >= 60 && precio <= 299:
                porcentaje = 0.18;
                break;
              case precio >= 300 && precio <= 699:
                porcentaje = 0.17;
                break;
              case precio >= 700 && precio <= 1000:
                porcentaje = 0.15;
                break;
              case precio > 1000:
                porcentaje = 0.14;
                break;
              default:
                break;
            }

           break;

    default:
      break;
  }

    resolve(factor + porcentaje);

  });

}

}
