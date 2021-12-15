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
import { ThousandSuffixesPipe }  from './pipes/thousand-suffixes.pipe';
import { MapValuesPipe } from './pipes/map-values.pipe'
import { DocPageComponent } from './visuals/shared/doc-page/doc-page.component';
import { ConceptGraphComponent } from './concept-graph/concept-graph.component';
import * as es from 'elasticsearch-browser/elasticsearch';
import {errors} from 'elasticsearch';
@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    ThousandSuffixesPipe,
    DocPageComponent,
    MapValuesPipe,
    ConceptGraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxPaginationModule
  ],
  providers: [D3Service, SearchService, 
    {
      provide: 'elasticsearch',
      useFactory: () => {
        return new es.Client({
          host: 'https://angular_reader:angular_reader_pwd@bib-index.es.europe-west3.gcp.cloud.es.io:9243',
            cloud: {
              id: "bib-index:ZXVyb3BlLXdlc3QzLmdjcC5jbG91ZC5lcy5pbyQwMmU0M2U2YWFiOTE0MTMyOTMyMTQxYWIzOTA0Yjc1YyQ3ZDlmNGZiNjg0MzA0YTZiYWYxNjNmODEyZjg5ZWYwOQ=="
            }
        }, (err: errors) => {
          console.log(err)
        });
      },
      deps: [],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
