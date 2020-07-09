import { Injectable } from '@angular/core';
import { Producto } from '../pages/interfaces/producto-interface';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  nuevoProducto = false;
  private firstSubject = new BehaviorSubject<boolean>(false);

  constructor(private productoService: ProductoService) {}

  async grabarShoppingCart(producto: Producto, cantidad?: number) {

    // Si no especifica la cantidad de productos, por default es 1
    if (cantidad) {
      producto.solicitud = cantidad;
    } else {
      producto.solicitud = 1;
    }

    // Nos traemos el porcentaje de descuernto
    producto.descuento = await this.productoService.getDescuento(producto.solicitud, producto.precioActual);

    // Validamos si es mayor a 1 quiere decir que si hubo descuento
    if (producto.descuento > 1) {
        producto.hasDescuento = true;
        // calculamos el precio nuevo con el descuento
        producto.precioConDescuento = Number.parseFloat(((producto.descuento / 1.38) * producto.precioActual).toFixed(2));
    } else {
        producto.hasDescuento = false;
        // Definimos el precio de descuernto igual al precio original
        producto.precioConDescuento = producto.precioActual;
    }

    // Queremos sumar solo los precios con descuento si no hay descuento sabemos que lleva el precio original
    producto.sumaTotal = Number.parseFloat((producto.solicitud * producto.precioConDescuento).toFixed(2));
    producto.sumaSinDescuento = Number.parseFloat((producto.solicitud * producto.precioActual).toFixed(2));
    // Guardamos el producto en el storage
    sessionStorage.setItem('producto_' + producto.idProducto, JSON.stringify(producto));

  }

  sendProductAddCart(add: boolean) {
    this.firstSubject.next(add);
  }

  getProductAddCartAlert(): Observable<boolean> {
      return this.firstSubject.asObservable();
  }

  obtenerShoppingCart(): Observable<Producto[]> {

    const items: Producto[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);

        if ( key.includes('producto')) {
          const producto = JSON.parse(sessionStorage.getItem(key));
          items.push(producto);
        }

    }

    return of(items);
  }

  borrarItemDelShoppingCart(idProducto: number) {
    const idShoppingCart = 'producto_' + idProducto;
    sessionStorage.removeItem(idShoppingCart);
  }

  setNuevoProducto(newProducto: boolean) {
    this.nuevoProducto = newProducto;
  }

  notificacionNuevoElementoCart(): Observable<boolean> {
      return of(this.nuevoProducto);
  }

}
