import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PageModule } from './pages/page.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UserProductoResolve } from './pages/page.resolve';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './pages/paginator-es';
import { RequestCacheService } from './cacheHTTP/request-cache.service';
import { CacheInterceptorService } from './cacheHTTP/cache-interceptor.service';
import { CheckoutResolve } from './pages/checkout.resolve';
import { NgxSoapModule } from 'ngx-soap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductResolver } from './pages/products.resolver';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PageModule,
    HttpClientModule,
    NgxSoapModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
  providers: [
      UserProductoResolve,
      ProductResolver,
      CheckoutResolve,
      CustomPaginatorIntl,
      { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl},
      RequestCacheService,
      { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true}
    ],
  bootstrap: [AppComponent]
})
export class AppModule {}
