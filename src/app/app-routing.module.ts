import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ProductsComponent } from './pages/products/products.component';
import { SingleProductComponent } from './pages/single-product/single-product.component';
import { UserProductoResolve } from './pages/page.resolve';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CheckoutResolve } from './pages/checkout.resolve';
import { ContactComponent } from './pages/contact/contact.component';
import { CatalogosComponent } from './pages/catalogos/catalogos.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ProductResolver } from './pages/products.resolver';


const routes: Routes = [
  { path: '',   redirectTo: 'index', pathMatch: 'full'},
  { path: 'index', component: IndexComponent, resolve: {boolean: ProductResolver}},
  {
    path: 'products', data: { animation: 'FilterPage'},
    children: [
      { path: '', component: ProductsComponent, resolve: {boolean: ProductResolver} },
      { path: ':search', component: ProductsComponent, resolve: {boolean: ProductResolver}},
      { path: 'single-product/:sku', component: SingleProductComponent, resolve: {producto: ProductResolver}
      }
    ],
  },
  { path: 'catalogos', component: CatalogosComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'checkout', component: CheckoutComponent, resolve: { carrito: CheckoutResolve} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 50],
    useHash: false // Remover al subir a producción
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
