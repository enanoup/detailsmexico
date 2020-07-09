import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Producto, Url } from '../interfaces/producto-interface';
import { ProductoService } from '../../services/producto.service';
import swal from 'sweetalert2';

let $ = (window as any)['jQuery'];

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})

export class SingleProductComponent implements OnInit, AfterViewInit {

    singleProduct: Producto = null;
    cantidad = 1; // Esta mapeado con ngModel y es el valor mínimo que aparece

    bestSellerProducts: Producto[] = [];
    newProducts: Producto[] = [];

  constructor(private route: ActivatedRoute,
              private shoppingService: ShoppingCartService,
              private productoService: ProductoService) {}


    loadFotorama(urls: Url[]) {

      const imgs = [];

      urls.forEach( url => {
          const obj = {
            img: url.url,
            thumb: url.url
          };
          imgs.push(obj);
      });

      // Revisar el API de Fotorama ahí viene todo
      const fotoramaDiv = $('.fotorama').fotorama();
      const fotorama = fotoramaDiv.data('fotorama');

      fotorama.load(imgs);
    }

    agregaProductoAlCarrito(producto: Producto) {

      if ( this.cantidad <= producto.cantidad) {
        this.shoppingService.grabarShoppingCart(producto, this.cantidad);

        setTimeout(() => {
          this.shoppingService.sendProductAddCart(true);
        }, 500);
      } else {
        swal.fire('Lo Sentimos',
        `Solo hay disponibles <strong>${ producto.cantidad }</strong>
        artículos de <br/><strong style="color: #921018;">${ producto.nombre }</strong>`,
        'error');
      }

    }

    async ngOnInit() {

    // Este producto viene del resolver para que cargue el prod antes de renderizar la pagina

    this.singleProduct = this.route.snapshot.data.producto;
    this.loadFotorama(this.singleProduct.urls);

    await this.productoService.getNewAndBestsellerProducts().then( resolve => {

      if ( resolve ) {
        resolve.forEach( producto => {
          if ( producto.nuevoProducto ) {
            this.newProducts.push( producto );
          } else {
            this.bestSellerProducts.push( producto );
          }
        });
      }

    });

    this.route.params.subscribe ( param => {
      this.route.snapshot = param.sku;
    });

  }



  ngAfterViewInit() {

    setTimeout(() => {

      // Activa el plugin para inciar el carrousel de productos
      $('.productcategory__slide--2').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        autoplay: true,
        autoplayTimeout: 5000,
        items: 3,
        navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>' ],
        dots: false,
        lazyLoad: true,
        responsive: {
            0: {
              items: 2
            },
            576: {
              items: 2
            },
            768: {
              items: 3
            },
            1920: {
              items: 4
            }
        }
      });

    }, 500);
  }

}
