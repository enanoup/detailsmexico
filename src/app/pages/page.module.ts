import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IndexComponent } from './index/index.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FooterComponent } from './footer/footer.component';
import { ProductsComponent } from './products/products.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { RouterModule } from '@angular/router';
import { SanitizerPipe } from '../pipes/sanitizer.pipe';
import { PaginatePipe } from '../pipes/paginate.pipe';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material';
import { SearchPipe } from '../pipes/search.pipe';
import { CheckoutComponent } from './checkout/checkout.component';
import { ContactComponent } from './contact/contact.component';
import { CatalogosComponent } from './catalogos/catalogos.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { FaqComponent } from './faq/faq.component';
// import { FragmentPolyfillModule } from '../fragment-polyfill.module';

@NgModule({
  declarations: [
    HeaderComponent,
    IndexComponent,
    FooterComponent,
    ProductsComponent,
    SingleProductComponent,
    SanitizerPipe,
    PaginatePipe,
    SearchPipe,
    ShoppingCartComponent,
    CheckoutComponent,
    ContactComponent,
    CatalogosComponent,
    FaqComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CarouselModule,
    RouterModule,
    FormsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    /*
    FragmentPolyfillModule.forRoot( {
      smooth: true
    }),
    */
  ],
  exports: [
    HeaderComponent,
    IndexComponent,
    FooterComponent,
    ProductsComponent,
    SingleProductComponent,
    SanitizerPipe,
    PaginatePipe,
    SearchPipe,
    CheckoutComponent,
    ContactComponent
  ]
})

export class PageModule { }
