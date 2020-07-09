import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PromolinePrice, PromolineProductSingle, PromolineActiveItem } from '../pages/interfaces/promoline-interface';
import { InnovationProduct } from '../pages/interfaces/innovation-interface';
import { Producto } from '../pages/interfaces/producto-interface';

/*
  ESTE SERVICIO CONECTA DIRECTO CON LOS WEB SERVICES DE LOS PROVEEDORES
  AQUÍ SE LLAMAN LOS REST (DIRECTO) Y LOS SOAP (MEDIANTE LA IMPLEMENTACION EN PHP)
 */
@Injectable({
  providedIn: 'root'
})
export class WsService {

  private wsBaseUrl = 'https://detailsmexico.com/ws/';

  private innivationApiKey = 'app-412454-ujd-7819';
  private importlineApiKey = 'ee2dfJykM4KEKE9OKjnIU89';

  private productosNuevosJSON = '../assets/json/new.json';
  private productosBestSellerJSON = '../assets/json/bestseller.json';

  constructor(private http: HttpClient) { }

  /*
    //////////////// WS PROMOOPCION
    //////////////// SOAP
  */

  /*
    WS PROMOOPCION
    Metodo: existencias
    Params: codigo: string
            distribuidor: string
    PHP https://detailsmexico.com/Promoopcion_getExistencias.php
  */

  getPromoopcionDatabase(): Observable<any> {

    return this.http.get('exportadb.php',
                      { responseType: 'text', params: { ubk: 'MX' }});
  }

  getPromoopcionExistencias(codigo: string): Observable<any> {

    const distribuidor = 'DFE6884'; // Preguntar si solo es este distribuidor
    return this.http.get(this.wsBaseUrl + 'Promoopcion_getExistencias.php',
                      { responseType: 'text', params: { codigo, distribuidor } });
  }

  /*
    WS PROMOOPCION
    Metodo: colorItem
    Params: codigo: string
    PHP https://detailsmexico.com/Promoopcion_getColorItem.php
  */
  getPromoopcionColorItem(codigo: string): Observable<any> {

    return this.http.get(this.wsBaseUrl + 'Promoopcion_getColorItem.php',
                    { responseType: 'text', params: { codigo } });
  }

  /*
    WS PROMOOPCION
    Metodo: colors
    Params: N/A
    PHP https://detailsmexico.com/Promoopcion_getColors.php
  */
  getPromoopcionColors(): Observable<any> {

    return this.http.get(this.wsBaseUrl + 'Promoopcion_getColors.php',
                    { responseType: 'text' });
  }

  /*
    WS PROMOOPCION
    Metodo: fichaTecnica
    Params: codigo: string
    PHP https://detailsmexico.com/Promoopcion_getFichaTecnica.php
  */
  getPromoopcionFichaTecnica(codigo: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'});

    return this.http.get(this.wsBaseUrl + 'Promoopcion_getFichaTecnica.php',
                    { responseType: 'text', params: { codigo } });
  }

  /*
   //////////////// WS PROMOLINE/PROMOSHOP
   //////////////// SOAP
  */

  /*
    WS PROMOLINE/PROMOSHOP
    Metodo: ProductInfoSingle
    Params: clave: string
    PHP https://detailsmexico.com/Promoline_getProductInfoSingle.php
  */
  getPromolineProductInfoSingle(clave: string): Observable<PromolineProductSingle> {

    return this.http.get<PromolineProductSingle>(this.wsBaseUrl + 'Promoline_getProductInfoSingle.php',
                      { responseType: 'json', params: { clave } });
  }

  getPromolineAllProducts(): Observable<PromolineProductSingle[]> {
    // Sin parametros se trae todos
    return this.http.get<PromolineProductSingle[]>(this.wsBaseUrl + 'Promoline_getAllProducts.php',
                            { responseType: 'json' });

  }

  /*
    WS PROMOLINE/PROMOSHOP
    Metodo: GetPrice
    Params: pass: string
    PHP https://detailsmexico.com/Promoline_getPrice.php
  */
  getPromolineGetPrice(): Observable<PromolinePrice[]> {
    // Se trae id de producto y precio
    const pass = 'CK9GK3';
    return this.http.get<PromolinePrice[]>(this.wsBaseUrl + 'Promoline_getPrice.php',
                      { responseType: 'json', params: { pass } });
  }

   /*
    WS PROMOLINE/PROMOSHOP
    Metodo: GetPriceByItem
    Params: pass: string
            clave: string
    PHP https://detailsmexico.com/Promoline_getPriceByItem.php
  */
  getPromolinePriceByItem(clave: string): Observable<any> {

    const pass = 'CK9GK3';
    return this.http.get(this.wsBaseUrl + 'Promoline_getPriceByItem.php',
                            { responseType: 'json', params: { clave, pass } });
  }

   /*
    WS PROMOLINE/PROMOSHOP
    Metodo: GetActiveItems
    Params: N/A
    PHP https://detailsmexico.com/Promoline_getActiveItems.php
  */
  getPromolineActiveItems(): Observable<PromolineActiveItem[]> {

    return this.http.get<PromolineActiveItem[]>(this.wsBaseUrl + 'Promoline_getActiveItems.php',
                      { responseType: 'json' });
  }

  /*
   //////////////// WS INNOVATION
   //////////////// REST
  */

  /*
    WS INNOVATION
    Metodo: producto.php
    Params: N/A
    Trae puras imagenes de productos
    PHP https://www.innovation.com.mx/webservice/producto.php?key=app-412454-ujd-7819
  */
  getInnovationGetImages(): Observable<any> {

    return null;
  }

  /*
    WS INNOVATION
    Metodo: productos.php
    Params: N/A
    Trae todos los productos
    PHP
  */
  getInnovationGetProducts(): Observable<InnovationProduct[]> {
    // Este es el que ya se trae todos los productos y los datos
    return this.http.get<InnovationProduct[]>(this.wsBaseUrl + 'Innovation_getProductos.php',
                      { params: { key: this.innivationApiKey } });
  }

  /*
    WS INNOVATION
    Metodo: productos_busqueda.php
    Params: search: string
    Búsqueda de los productos
    PHP https://www.innovation.com.mx/webservice/productos_busqueda.php?key=app-412454-ujd-7819&busqueda=%20azul
  */
  getInnovationBuscar(search: string): Observable<any>  {

    return null;
  }

  /*
   //////////////// WS IMPORTLINE
   //////////////// REST
  */

  /*
    WS IMPORTLINE
    Metodo: get-productos
    Params: N/A
    Se trae todos los productos
    PHP https://importline.com.mx/api_importline/service.php?key=ee2dfJykM4KEKE9OKjnIU89&action=get-productos
  */
  getImportlineGetProductos(): Observable<ImporlineResponse> {
    // Este se trae todos los productos, es el que vamos a usar.
    return this.http.get<ImporlineResponse>(this.wsBaseUrl + 'Importline_getProductos.php',
                { params: { key: this.importlineApiKey, action: 'get-productos' } });
  }

  /*
    WS IMPORTLINE
    Metodo: get-categorias
    Params: N/A
    Se trae todas las categorias
    PHP https://importline.com.mx/api_importline/service.php?key=ee2dfJykM4KEKE9OKjnIU89&action=get-productos
  */
  getImportlineGetCategorias(): Observable<any> {

    return null;
  }

 /*
  DATABASE BESTSELLER Y NEW PRODUCTS
  */

  getProductosNuevos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productosNuevosJSON);
  }

  getProductosBestSeller(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productosBestSellerJSON);
  }

}
