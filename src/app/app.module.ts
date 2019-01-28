import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { D3Service, D3_DIRECTIVES } from './d3';
import { SearchService } from './search.service'
import { AppComponent } from './app.component';

import { GraphComponent } from './visuals/graph/graph.component';
import { SHARED_VISUALS } from './visuals/shared';
import {NgxPaginationModule} from 'ngx-pagination';
import  { ThousandSuffixesPipe }  from './pipes/thousand-suffixes.pipe';
import { DocPageComponent } from './visuals/shared/doc-page/doc-page.component';
@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    ThousandSuffixesPipe,
    DocPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxPaginationModule
  ],
  providers: [D3Service, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
