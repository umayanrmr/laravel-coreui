import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconSetService } from '@coreui/icons-angular';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CoreModule } from './@core/core.module';
import { AppComponent } from './app.component';
// Import routing module
import { AppRoutingModule } from './app.routing';
// Import containers
import { DefaultLayoutComponent } from './containers';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};




const APP_CONTAINERS = [
  DefaultLayoutComponent
];




@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    PerfectScrollbarModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    IconSetService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
