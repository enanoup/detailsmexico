import { Component, OnInit, ElementRef } from '@angular/core';
import { Producto } from '../interfaces/producto-interface';
import { ShoppingCartService } from '../../services/shopping-cart.service';

let $ = (window as any)['jQuery'];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  productosCart: Producto[] = [];
  subTotal: number;
  nuevo = false;

  constructor(private cartService: ShoppingCartService, private element: ElementRef) {

  }

  ngOnInit() {

    this.obtenerShoppingCart();
    this.notificaNuevoElemento();

    this.cartService.getProductAddCartAlert().subscribe( resp => {

      if ( resp ) {
        const trigger = this.element.nativeElement.querySelector('#trigger');
        trigger.dispatchEvent(new Event('click'));
      }

    });

    // Aqui hacemos el parpadeo del telefono
    function myRepeat() {
      $('.phone-blink').delay(800).fadeOut(500).delay(50).fadeIn(500);
    }
    setInterval(myRepeat, 500);

    // Hamburguer menu para móviles
    $('nav.mobilemenu__nav').meanmenu({
      meanMenuClose: 'X',
      meanMenuCloseSize: '18px',
      meanScreenWidth: '991',
      meanExpandableChildren: true,
      meanMenuContainer: '.mobile-menu',
      onePage: true
  });

    this.cartToggler();
  }

  private cartToggler() {

    const trigger = $('.cartbox_active');
    const container = $('.minicart__active');

    // Si se aprieta el carrito, aparece el DIV CALCULADOR
    trigger.on('click', function (e) {
      e.preventDefault();
      container.toggleClass('is-visible');
    });

    // Se desaparece la clase visible si es que estaba visible
    trigger.on('click', function (e) {
      e.preventDefault();
      container.toggleClass('');
    });

    // Si se aprieta la X tambien se oculta
    $('.micart__close').on('click', function () {
      container.removeClass('is-visible');
    });
  }

    obtenerShoppingCart() {
     this.cartService.obtenerShoppingCart().subscribe( data => {
      this.productosCart = data;
      this.calcularSubtotal();
    });
  }

  private notificaNuevoElemento() {
    this.cartService.notificacionNuevoElementoCart().subscribe( valor => {
      this.nuevo = valor;
  });
  }

  private calcularSubtotal() {

    let suma = 0;
    this.productosCart.forEach( producto => {

          suma += producto.sumaTotal;
      });

    this.subTotal = Number.parseFloat(suma.toFixed(2));
  }

  refresh() {
    this.obtenerShoppingCart();
  }

}
