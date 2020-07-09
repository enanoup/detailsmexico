import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Producto } from './interfaces/producto-interface';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Injectable()
export class CheckoutResolve implements Resolve<Producto[]> {

  constructor(private shoppingCartService: ShoppingCartService) {}

  resolve() {
    let carrito: Producto[] = [];

    // Obtengo lso productos del carrito y sumo el total de cada producto
    this.shoppingCartService.obtenerShoppingCart().subscribe( productos => {
        carrito = productos;
        if (carrito.length > 0) {
           carrito.forEach( async producto => {
             // Siempre vamos a tomar el precio con descuento
                producto.sumaSinDescuento = Number.parseFloat((producto.solicitud * producto.precioActual).toFixed(2));
                producto.sumaTotal = Number.parseFloat((producto.solicitud * producto.precioConDescuento).toFixed(2));
           });
        }
    });

    return carrito;
  }

}
