import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../interfaces/producto-interface';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {

  productos: Producto[] = [];
  searchCriteria = '';
  sendSearchValue = '';
  results = 0;

  pageSize = 0;
  pageNumber = 0;
  pageSizeOptions = [24, 48, 96];
  paginator = null;

  loading = false;

  @ViewChild('paginator') paginatorRef: MatPaginator;

  constructor(private productoService: ProductoService,
              private storageService: LocalStorageService,
              private route: ActivatedRoute) {}

  // Cada que cambia el buscador o selecciona categoria se resetea el paginador
  resetPager() {
   this.paginatorRef.firstPage();
  }

  // MatPaginator Output
  handlePage( e: PageEvent ) {
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex + 1;
  }

  sendSearch() {
    this.sendSearchValue = this.searchCriteria;
    this.results = this.productoService.getPipeResults();
  }

  async ngOnInit() {

      this.loading = await this.loadAllProducts();

      // Vemos si viene un parámetro desde el Single Product
      if ( this.route.snapshot.params.search ) {
        this.sendSearchValue = this.route.snapshot.params.search;
      }

      /*
      Esta funcion es para cuando eliga una categoría cambia la URL pero no
      renderiza el componente nuevamente, entonces monitoreo la URL para cuando cambie
      asigno el valor del segmento o path al pipe
      */
      this.route.url.subscribe ( urlSegment => {
        if ( urlSegment.length > 0 ) {
          this.sendSearchValue = urlSegment[0].path;
        }
      });

  }

  loadAllProducts(): Promise<boolean> {

    return new Promise ( resolve => {

      this.storageService.getAllProducts().then( resolveProducts => {
        if  ( resolveProducts ) {
          this.productos = resolveProducts;
          resolve( true );
        } else {
          console.log('No llegaron los productos');
          resolve( false );
        }
      });

    });

  }

  obtenerProductosXCategoria( search: string ) {
      this.sendSearchValue = search;
  }

}
