import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar';
import { HeroComponent } from './hero/hero';
import { FeaturedCollectionsComponent } from './featured-collections/featured-collections';
import { ProductGridComponent } from './product-grid/product-grid';
import { AboutComponent } from './about/about';
import { ContactComponent } from './contact/contact';
import { FooterComponent } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FeaturedCollectionsComponent,
    ProductGridComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <app-hero></app-hero>
    <app-featured-collections></app-featured-collections>
    <app-product-grid></app-product-grid>
    <app-about></app-about>
    <app-contact></app-contact>
    <app-footer></app-footer>
  `,
  styles: []
})
export class AppComponent {}
