import { NgModule, InjectionToken, ElementRef, Inject, Directive, OnInit, OnDestroy, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModuleWithProviders } from '@angular/compiler/src/core';

// Esta clase arregla los link ANCHOR

/*

export interface WindowScrollerOptions {
  smooth: boolean;
}

export const WINDOW_SCROLLER_OPTIONS = new InjectionToken<WindowScrollerOptions>( 'WindowScroller.Options' );

// I provide the dependency-injection token for the window-scroller so that it can be
// more easily injected into the FragmentTarget directive. This allows other developers
// to provide an override that implements this Type without have to deal with the silly
// @Inject() decorator.
export abstract class WindowScroller {
  abstract scrollIntoView( elementRef: ElementRef ): void;
}

// I provide an implementation for scrolling a given Element Reference into view. By
// default, it uses the native .scrollIntoView() method; but, it can be overridden to
// use something like a jQuery plug-in, or other custom implementation.
@Injectable()
export class NativeWindowScroller implements WindowScroller {

  private behavior: 'auto' | 'smooth';
  private timer: any;

  // I initialize the window scroller implementation.
  public constructor( @Inject( WINDOW_SCROLLER_OPTIONS ) options: WindowScrollerOptions ) {
    
      this.behavior = ( options.smooth ? 'smooth' : 'auto' );
      this.timer = null;

  }

  // ---
  // PUBLIC METHODS.
  // ---

  // I scroll the given ElementRef into the client's viewport.
  public scrollIntoView( elementRef: ElementRef ): void {

      // NOTE: There is an odd race-condition that I cannot figure out. The initial
      // scrollToView() will not work when the BROWSER IS REFRESHED. It will work if
      // the page is opened in a new tab; it only fails on refresh (WAT?!). To fix this
      // peculiarity, I'm putting the first scroll operation behind a timer. The rest
      // of the scroll operations will initiate synchronously.
      if ( this.timer ) {

          this.doScroll( elementRef );

      } else {

          this.timer = setTimeout(
              (): void => {

                  this.doScroll( elementRef );

              },
              0
          );

      }

  }

  // ---
  // PRIVATE METHOD.
  // ---

  // I perform the scrolling of the viewport.
  private doScroll( elementRef: ElementRef ): void {

      elementRef.nativeElement.scrollIntoView({
          behavior: this.behavior,
          block: 'start'
      });

  }

}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[id], a[name]',
  // tslint:disable-next-line: no-inputs-metadata-property
  inputs: [ 'id', 'name' ]
})
export class FragmentTargetDirective implements OnInit, OnDestroy {

  public id: string;
  public name: string;

  private activatedRoute: ActivatedRoute;
  private elementRef: ElementRef;
  private fragmentSubscription: Subscription;
  private windowScroller: WindowScroller;

  // I initialize the fragment-target directive.
  constructor(
      activatedRoute: ActivatedRoute,
      elementRef: ElementRef,
      windowScroller: WindowScroller
      ) {

      this.activatedRoute = activatedRoute;
      this.elementRef = elementRef;
      this.windowScroller = windowScroller;

      this.id = null;
      this.fragmentSubscription = null;
      this.name = null;

  }

  // ---
  // PUBLIC METHODS.
  // ---

  // I get called once when the directive is being destroyed.
  public ngOnDestroy(): void {

      // tslint:disable-next-line: no-unused-expression
      ( this.fragmentSubscription ) && this.fragmentSubscription.unsubscribe();

  }


  // I get called once after the inputs have been bound for the first time.
  public ngOnInit(): void {

      this.fragmentSubscription = this.activatedRoute.fragment.subscribe(
          ( fragment: string ): void => {

              if ( ! fragment ) {

                  return;

              }

              if (
                  ( fragment !== this.id ) &&
                  ( fragment !== this.name )
                  ) {

                  return;

              }

              this.windowScroller.scrollIntoView( this.elementRef );

          }
      );

  }

}

interface ModuleOptions {
  smooth?: boolean;
}

@NgModule({

  exports: [
    FragmentTargetDirective
  ],
  declarations: [ FragmentTargetDirective ],
  imports: [
    CommonModule
  ]
})
export class FragmentPolyfillModule {

  static forRoot( options?: ModuleOptions ): ModuleWithProviders {

    return({
        ngModule: FragmentPolyfillModule,
          providers: [
              {
                provide: WINDOW_SCROLLER_OPTIONS,
                useValue: {
                    smooth: ( ( options && options.smooth ) || false )
                }
            },
            {
                provide: WindowScroller,
                useClass: NativeWindowScroller
            }
        ]
      });

    }

}
*/
