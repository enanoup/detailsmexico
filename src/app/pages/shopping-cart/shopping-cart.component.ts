import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Producto } from '../interfaces/producto-interface';
import { ShoppingCartService } from '../../services/shopping-cart.service';
let $ = (window as any)['jQuery'];

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  @Input() productosCart: Producto[] = [];
  @Input() subtotal: number;
  @Output() refreshCart = new EventEmitter();

  constructor(private shoppingService: ShoppingCartService, private element: ElementRef) { }

  ngOnInit() {

    this.blink();

  }

  // Manda a actualizar el carrito para que se vea en tiempo real
  refreshCartEmitter() {
    this.refreshCart.emit();
  }

  borrarItem(idProducto: number) {
    this.shoppingService.borrarItemDelShoppingCart(idProducto);
  }

  closeShoppingCart() {
      const trigger = this.element.nativeElement.querySelector('.micart__close');
      trigger.dispatchEvent(new Event('click'));
  }


  // Hay que averiguar como hacer que parpadee
  blink() {

    $('span').find('.blink').each( function() {
      $(this).fadeOut(500).delay(250).fadeIn(500, this.blink());
    });

  }

}
