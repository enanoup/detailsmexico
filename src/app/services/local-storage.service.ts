import { Injectable } from '@angular/core';
import { Producto } from '../pages/interfaces/producto-interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveAllProducts(productos: Producto[]) {
    sessionStorage.setItem('allProducts', JSON.stringify(productos));
  }

  getAllProducts(): Promise<Producto[]> {
    return new Promise( resolve => {

        let productos: Producto[] = [];
        productos = JSON.parse(sessionStorage.getItem('allProducts'));

        resolve(productos);
    });
  }

  saveNewAndBestSellerProducts( productos: Producto[]) {
    sessionStorage.setItem('newAndBestseller', JSON.stringify(productos));
  }

  getNewAndBestsellerProducts(): Promise<Producto[]> {
    return new Promise ( resolve => {
      let newAndBestseller: Producto[] = [];
      newAndBestseller = JSON.parse(sessionStorage.getItem('newAndBestseller'));

      resolve(newAndBestseller);
    });
  }
}
