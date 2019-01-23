import { Component, OnInit } from '@angular/core';
import APP_CONFIG from './app.config';
import { Node, Link } from './d3';
import { Client } from 'elasticsearch-browser';
import { SearchService } from './search.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    nodes: Node[] = [];
    links: Link[] = [];
    realLinks: Link[] = [];
    client: Client;
    graphResults: any = [];
    docResults:any = [];
    searchBoxText:string = "";
    constructor(private es: SearchService) {
    }
    ngOnInit() {
        this.es.makeConnections()
            .then(response => {
                const N = response.aggregations.nodes.buckets.length,
                    getIndex = number => number - 1;
                let nodes: Node[] = [];
                this.graphResults = response.aggregations.nodes.buckets;
                for (let node of this.graphResults) {
                    nodes.push(new Node(node.key));
                }
                let nodeIter = 0;
                for (let node of this.graphResults) {
                    for (let edge of node.edges.buckets) {
                        if (edge.key !== node.key) {
                            nodes[nodeIter].linkCount++;
                            let edgeIndex = nodes.findIndex(function (item, i) {
                                return item.id === edge.key
                            });
                            nodes[edgeIndex].linkCount++;
                            // links.push(new Link(node.key,edge.key));
                        }
                    }
                    nodeIter++;
                }
                this.nodes = nodes;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            }
            );


    }
    openLinks(key) {
        let nodeIndex = this.graphResults.findIndex(function (item, i) {
            return item.key === key
        });
        let links: Link[] = [];

        for (let edge of this.graphResults[nodeIndex].edges.buckets) {
            if (edge.key !== key) {
                links.push(new Link(key, edge.key));
            }
        }
        this.links = links;
        this.getResultByTopics(key,this.searchBoxText);
    }
    //getNetwork
    getGraphAndDocs(text){
        this.getNetwork(text);
        this.getResultDocs(text);
    }
    getNetwork(text) {
        this.links = [];
        this.es.searchGraph(text)
            .then(response => {
                const N = response.aggregations.nodes.buckets.length,
                    getIndex = number => number - 1;
                let nodes: Node[] = [];
                this.graphResults = response.aggregations.nodes.buckets;
                for (let node of this.graphResults) {
                    nodes.push(new Node(node.key));
                }
                let nodeIter = 0;
                for (let node of this.graphResults) {
                    for (let edge of node.edges.buckets) {
                        if (edge.key !== node.key) {
                            nodes[nodeIter].linkCount++;
                            let edgeIndex = nodes.findIndex(function (item, i) {
                                return item.id === edge.key
                            });
                            nodes[edgeIndex].linkCount++;
                            // links.push(new Link(node.key,edge.key));
                        }
                    }
                    nodeIter++;
                }
                this.nodes = nodes;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            });
    }
    //get facets and hits. 
    getResultDocs(text){
        this.es.getDocuments(text)
            .then(response => {
                this.docResults = response.hits.hits;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            });
    }
    getResultByTopics(topic,text){
        text = text || "";
        this.es.getDocumentsByTopic(topic,text)
            .then(response => {
                this.docResults = response.hits.hits;
            }, error => {
                console.error(error);
            }).then(() => {
                console.log('Search Completed!');
            });
    }
}
