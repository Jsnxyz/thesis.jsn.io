import { Injectable, isDevMode } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import { log } from 'async';


const _lawSource: string = '_id,metadata.abbreviation,metadata.createdDate,metadata.lastChangedDate,metadata.importedDate,title,source,documentIdent'; //Add fields if need to be retrieved
const _index: string = 'document-service';
const _lawType: string = 'Laws';
const _sectionType: string = 'Sections';

declare var LHS_FRONTEND_PORT: number;
declare var LHS_PUBLIC_DOMAIN: string;

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
    network_facet_query = {
        "size": 0,
        "aggs": {
            "subject_facet": {
                "terms": {
                    "field": "Subjects.keyword",
                    "size": 5
                }
            },
            "contributors_facet": {
                "terms": {
                    "field": "Contributors.keyword",
                    "size": 5
                }
            },
            "publication_year_facet": {
                "terms": {
                    "field": "Publication Year.keyword",
                    "size": 5
                }
            },
            "publisher_facet": {
                "terms": {
                    "field": "Publisher Name.keyword",
                    "size": 5
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
    private client: Client;

    constructor() {
        if (!this.client) {
            this.connect();
        }
    }

    private connect() {
        let host = `http://35.204.165.225:9200`;

        this.client = new Client({
            host,
            auth: 'elastic:Hsyy81i8'
        });
    }


    createIndex(name): any {
        return this.client.indices.create(name);
    }

    isAvailable(): any {
        return this.client.ping({
            requestTimeout: Infinity,
            body: 'hello JavaSampleApproach!'
        });
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
            type: "bib-type",
            body: this.network_facet_query
        });
    }

    getDocsQuery(text){
        return {
            "query": {
                "bool": {
                    "must": [
                        {
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
                    ]
                }
            }
        }
    }

    searchGraph(text) {
        let query = this.getDocsQuery(text);
        query["size"] = 0;
        query["aggs"] = this.network_facet_query.aggs;
        return this.client.search({
            index: "bib-index",
            type: "bib-type",
            body: query
        });
    }
    getDocuments(text) {
        return this.client.search({
            index: "bib-index",
            type: "bib-type",
            _source: "Uniform Title,Main Title,Contributors,Description,Subjects,Topics",
            body: this.getDocsQuery(text)
        });
    }
    getDocumentsByTopic(text: string = "", topic, facets = {} ) {
        let query: any = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "Topics.keyword": topic
                            }
                        }
                    ]
                }
            }
        }
        if (text) {
            let textQuery = {
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
            query.query.bool.must.push(textQuery);
        }
        return this.client.search({
            index: "bib-index",
            type: "bib-type",
            _source: "Uniform Title,Main Title,Contributors,Description,Subjects,Topics",
            body: query
        });
    }
}
