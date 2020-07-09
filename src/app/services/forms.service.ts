import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Producto } from '../pages/interfaces/producto-interface';
import { ProductoCarrito } from '../pages/interfaces/producto-carrito';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }

  sendCheckoutForm(
    nombre: string, email: string, telefono: string, productos: Producto[],
    totalConIva: string, urlLogo: string, recaptcha: string): Observable<any> {

    // Convertimos el arreglo de productos a un string
    const prodCarrito = JSON.stringify(this.convertProductoToProductoCarrito(productos));
    if ( urlLogo == null || urlLogo === '' ) {
      urlLogo = 'Sin logo';
    }

    return this.http.get(environment.urlForms + 'envio-checkout.php',
        { responseType: 'text', params: { nombre, email, telefono, prodCarrito, totalConIva, urlLogo, recaptcha } });

  }

  uploadLogo(file: File): Promise<any> {
    // tslint:disable-next-line: no-debugger
    // debugger;
    const formData: FormData = new FormData();

    return new Promise( resolve => {

      formData.append('logo', file, file.name);
      this.http.post('https://detailsmexico.com/uploads/file-upload.php', formData,
        { responseType: 'text'})
        .subscribe( resp => {
          resolve(resp);
      });
    });

  }

  sendContactForm( nombre: string, apellido: string, email: string,
                   telefono: string, mensaje: string, recaptcha: string): Observable<any> {

    return this.http.get(environment.urlForms + 'envio-contacto.php',
        {responseType: 'text', params: { nombre, apellido, email, telefono, mensaje, recaptcha }});
  }

  sendEmailMarketingForm(name: string, email: string, recaptcha: string ) {
    return this.http.get(environment.urlForms + 'envio-marketing.php',
        {responseType: 'text', params: {name, email, recaptcha }});
  }

  sendEmailReferidosForm(name: string, email: string, nameRef: string, emailRef: string) {
    return this.http.get(environment.urlForms + 'envio-referidos.php',
        {responseType: 'text', params: {name, email, nameRef, emailRef}});
  }

  convertProductoToProductoCarrito(productos: Producto[]): ProductoCarrito[] {

    const allProductosCarrito: ProductoCarrito[] = [];

    if ( productos.length > 0 ) {

      productos.forEach( producto => {

        const productoCarrito: ProductoCarrito = {
          sku: '',
          proveedor: '',
          nombre: '',
          url: '',
          solicitud: 0,
          precioUnitario: 0,
          precioDescuento: 0,
          total: 0
        };

        productoCarrito.sku = producto.sku;
        productoCarrito.nombre = producto.nombre;
        productoCarrito.proveedor = producto.proveedor;
        productoCarrito.url = producto.urls[0].url;
        productoCarrito.solicitud = producto.solicitud;
        productoCarrito.precioUnitario = producto.precioActual;
        productoCarrito.precioDescuento = producto.precioConDescuento;
        productoCarrito.total = producto.sumaTotal;

        allProductosCarrito.push(productoCarrito);

      });

    } else {
      console.log( 'No hay productos en el carrito ');
    }

    return allProductosCarrito;
  }

}
