import { Injectable, Inject } from '@angular/core';

@Injectable()
export class SearchService {
    network_query = {
        "size": 0,
        "aggs": {
            "nodes": {
                "terms": {
                    "field": "Topics.keyword",
                    "size": 200
                },
                "aggs": {
                    "edges": {
                        "terms": {
                            "field": "Topics.keyword",
                            "size": 200
                        }
                    }
                }
            }
        }
    }
    more_facet_query = {
        "size" : 0,
        "aggs" : {
            "facets": {
                "terms" : {
                    "size" : 100
                }
            }
        }
    }
    network_facet_query = {
        "size": 0,
        "aggs": {
            "subject_facet": {
                "terms": {
                    "field": "Subjects.keyword",
                    "size": 6
                }
            },
            "contributors_facet": {
                "terms": {
                    "field": "Contributors.keyword",
                    "size": 6
                }
            },
            "publication_year_facet": {
                "terms": {
                    "field": "Publication Year",
                    "size": 6
                }
            },
            "publisher_facet": {
                "terms": {
                    "field": "Publisher Name.keyword",
                    "size": 6
                }
            },
            "nodes": {
                "terms": {
                    "field": "Topics.keyword",
                    "size": 200
                },
                "aggs": {
                    "edges": {
                        "terms": {
                            "field": "Topics.keyword",
                            "size": 200
                        }
                    }
                }
            }
        }
    }
    
    constructor(@Inject('elasticsearch') private readonly client) {
    }


    createIndex(name): any {
        return this.client.indices.create(name);
    }

    isAvailable(): any {
        return new Promise( (resolve, reject) => {
            this.client.ping({
                // ping usually has a 3000ms timeout
                requestTimeout: 1000
              }, function (error) {
                if (error) {
                  reject('elasticsearch cluster is down!');
                } 
                resolve('All is well');
              });
        })
        
    }

    addToIndex(value): any {
        return this.client.create(value);
    }

    getAllDocumentsWithScroll(_index, _type, _size): any {
        return this.client.search({
            index: _index,
            type: _type,
            scroll: '1m',
            filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
            body: {
                'size': _size,
                'query': {
                    'match_all': {}
                },
                'sort': [
                    { '_uid': { 'order': 'asc' } }
                ]
            }
        });
    }

    getNextPage(scroll_id): any {
        return this.client.scroll({
            scrollId: scroll_id,
            scroll: '1m',
            filterPath: ['hits.hits._source', 'hits.total', '_scroll_id']
        });
    }

    makeConnections() {
        return this.client.search({
            index: "bib-index",
            body: this.network_facet_query
        });
    }
    getSkeletonQuery(){
        return {
            "query": {
                "bool": {
                    "must": [
                        
                    ]
                }
            }
        }
    }
    getDocsQuery(text){
        let query = this.getSkeletonQuery();
        query.query.bool.must.push({
            "multi_match": {
                "query": text,
                "minimum_should_match": "80%",
                "fields": [
                    "Creator^2",
                    "Title^4",
                    "Description",
                    "ISBN",
                    "ISSN",
                    "Publisher^2",
                    "Serial Title",
                    "Series^3",
                    "Subjects^2"
                ]
            }
        });
        query['rescore'] = {
            "window_size": 50, 
            "query": {         
                "rescore_query": {
                    "multi_match": {
                        "query": text,
                        "fields": [
                            "Creator^2",
                            "Title^4",
                            "Description",
                            "ISBN",
                            "ISSN",
                            "Publisher^2",
                            "Serial Title",
                            "Series^3",
                            "Subjects^2"
                        ],
                        "type": "phrase"
                    }
                }
            }
        }
        return query;
    }
    getMoreFacets(text,facetName,facets) {
        let query = {};
        if(text){
            query = this.getDocsQuery(text);
        } else {
            query = this.getSkeletonQuery();
        }
        query["size"] = 0;
        query["aggs"] = this.more_facet_query.aggs;
        query["aggs"]["facets"]["terms"]["field"] = !facetName.startsWith("Publication Y") ? facetName + ".keyword" : facetName;
        let facet_query = this.loadFacetsToQuery(facets, facetName);
        for(let facet of facet_query){
            query["query"]["bool"]["must"].push(facet);
        }
        return this.client.search({
            index: "bib-index",
            body: query
        });
    }
    searchGraph(text,facets?:any) {
        let query;
        if(text){
            query = this.getDocsQuery(text);
        } else {
            query = this.getSkeletonQuery();
        }
        query["size"] = 0;
        query["aggs"] = this.network_facet_query.aggs;
        let facet_query = this.loadFacetsToQuery(facets);
        for(let facet of facet_query){
            query["query"]["bool"]["must"].push(facet);
        }
        return this.client.search({
            index: "bib-index",
            body: query
        });
    }
    getGraphNoFacetUpdate(text,facets?:any){
        let query;
        if(text){
            query = this.getDocsQuery(text);
        } else {
            query = this.getSkeletonQuery();
        }
        query["size"] = 0;
        query["aggs"] = this.network_query.aggs;
        let facet_query = this.loadFacetsToQuery(facets);
        for(let facet of facet_query){
            query["query"]["bool"]["must"].push(facet);
        }
        return this.client.search({
            index: "bib-index",
            body: query
        });
    }
    loadFacetsToQuery(facets, moreFacetKey?){
        let facet_arr = [];
        for(let facet in facets){
            if(moreFacetKey == facet){
                continue;
            }
            let facetName = this.removeUnderscore(facet);
            if(facetName == 'Topics' && facets[facet].length > 0){
                for(let value of facets["Topics"]){
                    facet_arr.push({term: {"Topics.keyword": value}});
                }
            } else if(facets[facet].length > 0){
                let term = { terms : {}};
                if(!facetName.startsWith("Publication "))
                    term.terms[facetName + ".keyword"] = facets[facet];
                else 
                    term.terms[facetName] = facets[facet];
                facet_arr.push(term);
            }
        }
        return facet_arr;
    }
    removeUnderscore(text){
        return text.replace("_"," ");
    }
    getDocuments(text,facets?:any,pageNo = 1, loadFacets = false) {
        let query;
        let ifOnlyTopicSelected = true;
        for(let facetKey in facets){
            if(facetKey !== "Topics" && facets[facetKey].length > 0) {
                ifOnlyTopicSelected = false;
            }
        }
        if(text){
            query = this.getDocsQuery(text);
            ifOnlyTopicSelected = false;
        } else {
            query = this.getSkeletonQuery();            
        }
        if(ifOnlyTopicSelected){
            if(facets["Topics"] && ifOnlyTopicSelected){
                let topicString = Array(facets["Topics"]).toString().replace(","," "); 
                query['rescore'] = {
                    "window_size": 50, 
                    "query": {         
                        "rescore_query": {
                            "multi_match": {
                                "query": topicString,
                                "fields": [
                                    "Creator^2",
                                    "Title^4",
                                    "Description",
                                    "ISBN",
                                    "ISSN",
                                    "Publisher^2",
                                    "Serial Title",
                                    "Series^3",
                                    "Subjects^2"
                                ],
                                "minimum_should_match": "80%"
                            }
                        }
                    }
                }
            }
        }
        if(loadFacets){
            query["aggs"] = this.network_facet_query.aggs;
        }
        let facet_query = this.loadFacetsToQuery(facets);
        for(let facet of facet_query){
            query["query"]["bool"]["must"].push(facet);
        }
        
        return this.client.search({
            index: "bib-index",
            _source: "Publication Year,Title,Uniform Title,Main Title,Contributors,Description,Subjects,Topics,thumbnail,ISBN",
            from: (pageNo - 1) * 10,
            body: query
        });
    }
    getDocument(id){
        return this.client.get({
            index: "bib-index",
            id: id
        });
    }
    getMLTById(id){
        return this.client.search({
            index: "bib-index",
            _source: "Main Title,Topics,Title",
            body: {
                    "size" : 20,
                     "query": {
                         "more_like_this" : {
                             "fields": ["Title", "Description", "Series", "Uniform Title", "Creator", "Contributors", "Subjects"],
                             "like" : [
                             {
                                 "_index" : "bib-index",
                                 "_id" : id
                             }
                            ],
                            "include" : "true"
                         }
                    }
            }
        })
    }
}
