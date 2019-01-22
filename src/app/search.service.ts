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
    query = {
        "size": 0,
        "query": {
            "bool": {
                "should": [
                    {
                        "multi_match": {
                            "query": "multi agent",
                            "fields": [
                                "Main Title",
                                "Title"
                            ],
                            "type": "phrase"
                        }
                    }
                ]
            }
        },
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
            body: this.query
        });
    }
}
