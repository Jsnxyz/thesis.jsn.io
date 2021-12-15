import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { D3Service, D3_DIRECTIVES } from './d3';
import { SearchService } from './search.service'



import { SHARED_VISUALS } from './components/visuals/shared';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThousandSuffixesPipe }  from './pipes/thousand-suffixes.pipe';
import { MapValuesPipe } from './pipes/map-values.pipe'

import * as es from 'elasticsearch-browser/elasticsearch';

// Components import 
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SelectedFiltersComponent } from './components/selected-filters/selected-filters.component';
import { DocPageComponent } from './components/doc-page/doc-page.component';
import { ConceptGraphComponent } from './components/concept-graph/concept-graph.component';
import { GraphComponent } from './components/visuals/graph/graph.component';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { FiltersComponent } from './components/filters/filters.component';
import { HeaderComponent } from './components/header/header.component';
import { ResultsComponent } from './components/results/results.component';
import { SearchComponent } from './pages/search/search.component';
@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    ThousandSuffixesPipe,
    DocPageComponent,
    MapValuesPipe,
    ConceptGraphComponent,
    PageNotFoundComponent,
    SelectedFiltersComponent,
    ExplorerComponent,
    FiltersComponent,
    HeaderComponent,
    ResultsComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxPaginationModule,
    AppRoutingModule
    
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
        });
      },
      deps: [],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
