import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Producto } from '../interfaces/producto-interface';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  @ViewChild('Total') total: ElementRef;

  productosCarrito: Producto[] = [];
  subTotal = 0;
  descuento = 0;
  cantidadChange = 0;
  ahorroTotal = 0;
  iva = 1.16;

  nombre: string;
  email: string;
  telefono: string;
  logo: boolean;

  checkoutForm: any;
  subscription: Subscription;

  checkbox = false;
  fileData: File = null;
  imageUrl = ''; // aqui guarda la URL completa de la imagen
  message = '';
  imagePath: any;
  imageRender: any;

  // Google reCaptcha
  recaptcha: string;
  siteKey = environment.recaptcha_webkey;

  constructor(private route: ActivatedRoute, private router: Router,
              private shoppingService: ShoppingCartService,
              private formBuilder: FormBuilder,
              private formService: FormsService) {

                this.checkoutForm = this.formBuilder.group({
                  nombre: new FormControl(this.nombre, [Validators.required, Validators.minLength(4)]),
                  email: new FormControl(this.email, [Validators.required, Validators.email]),
                  telefono: new FormControl(this.telefono),
                  total: new FormControl(this.total),
                  logo: new FormControl(this.logo),
                  recaptcha: new FormControl(this.recaptcha, [Validators.required])
                });
  }

  // Este va a sumar el subtotal antes del descuento
  sumaSubtotal() {
      let totalParcial = 0;
      let totalSinDescuento = 0;

      for ( const producto of this.productosCarrito) {
        totalParcial += producto.sumaTotal;
        totalSinDescuento += producto.sumaSinDescuento;
      }

      this.subTotal = Number.parseFloat((totalParcial).toFixed(2));
      this.ahorroTotal = Number.parseFloat((totalSinDescuento - totalParcial).toFixed(2));
   }

   updateCart( event: any, producto: Producto ) {

      let value: boolean;

    // Validamos las existencias del producto
      if ( this.validarExistencias(event.target.value, producto)) {
        this.cantidadChange = event.target.value;
        this.shoppingService.grabarShoppingCart( producto, this.cantidadChange );
        this.checkoutForm.reset();
        // En lo que se graba el carrito otra vez me espero para que la suma tome los cambios
        setTimeout(() => {
          this.sumaSubtotal();
        }, 500);
        value = true;
      }
   }

   quitarProducto(idProducto: number) {
      this.shoppingService.borrarItemDelShoppingCart(idProducto);
      this.obtenerShoppingCart();
      console.log('Se borró');
   }

   private obtenerShoppingCart() {
    this.shoppingService.obtenerShoppingCart().subscribe( data => {
      this.productosCarrito = data;
    });
    this.sumaSubtotal();
    this.shoppingService.sendProductAddCart(true);
  }

  async uploadFile() {

     await this.formService.uploadLogo(this.fileData).then( resp => {
       if (resp) {
         this.imageUrl = resp;
       }
     });

  }

  async handleFileInput( event: any ) {
    this.fileData = event.target.files[0];

    console.log(this.fileData.size);
    if (this.fileData.size === 0) {
      return;
    }

    if (this.fileData.size > 3000000) {
      this.message = 'Solo puedes subir hasta 3 MB';
      this.imageRender = null;
      return;
    }
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Solo imagenes son soportadas.';
      return;
    }

    const reader = new FileReader();

    // Aqui se lee el archivo para mostrarse en pantalla
    reader.readAsDataURL(this.fileData);
    reader.onload = () => {
      this.imageRender = reader.result;
      if ( this.imageRender ) {
        this.message = '';
      }
    };

  }

  onChangeCheckbox( event: any) {
    this.checkbox = event.target.checked;
    if (!this.checkbox) {
      this.imageRender = null;
      this.message = '';
      this.fileData = null;
    }
  }

  async onSubmit(customerData: any) {

    // Validamos que haya productos para mandar en el Checkout
    if ( this.extraerProductos().length > 0 ) {

    /* Validamos que si esta seleccionada la opcion de subir archivo,
    aseguramos que haya arriba uno y si no, detendrá el submit */
      if (this.checkbox && this.fileData != null) {
        /* Validamos el tamaño de la imagen que no exceda 3 MB */
        if ( this.fileData.size <= 3000000) {
          await this.uploadFile();
        } else {
          this.message = 'El archivo no debe de ser mayor de 3 MB';
        }

      } else if ( this.checkbox && this.fileData == null ) {
        this.message = 'Debes de seleccionar un archivo o quitar la selección';
        return;
      }

      this.subscription =
          this.formService.sendCheckoutForm(
              customerData.nombre, customerData.email, customerData.telefono,
              this.extraerProductos(), this.total.nativeElement.innerHTML, this.imageUrl, customerData.recaptcha)
              .subscribe( resp => {
                console.log('Respuesta: ', resp);
                swal.fire(`Gracias ${ customerData.nombre }`,
                'En breve nos comunicaremos contigo para darte detalles de tu cotización',
                'success').finally(() => {
                  this.checkoutForm.reset();
                  this.imageRender = null;
                  this.router.navigateByUrl('/checkout'); // Aqui direccionamos a la página de GRACIAS
                });
              });

      } else {
        swal.fire(`Lo Sentimos ${ customerData.nombre }`,
        'No existe ningun artículo en el carrito',
        'error').finally(() => {
          this.checkoutForm.reset();
          this.checkbox = false;
          // this.router.onSameUrlNavigation; // Aqui direccionamos a la página de GRACIAS
        });
      }
    }

    // Valida existencias en los cambios de cantidad en checkout
    validarExistencias( value: any, producto: Producto): boolean {

      if ( value <= producto.cantidad ) {
        return true;
      } else {
        return false;
      }
    }

    extraerProductos(): Producto[] {
      return this.productosCarrito;
    }

    resolvedCaptcha( response: any ) {
      this.recaptcha = response;
    }

    ngOnInit() {

      this.productosCarrito = this.route.snapshot.data.carrito;
      if ( this.productosCarrito.length > 0) {
        this.sumaSubtotal();
      }

    }

    ngOnDestroy() {
      if ( this.subscription ) {
        this.subscription.unsubscribe();
      }
    }

}
