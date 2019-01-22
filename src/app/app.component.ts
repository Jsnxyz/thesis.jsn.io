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
    res: any = {};

    constructor(private es: SearchService) {
    }
    ngOnInit() {
        this.es.makeConnections()

            .then(response => {
                const N = response.aggregations.nodes.buckets.length,
                    getIndex = number => number - 1;

                /** constructing the nodes array */
                // for (let i = 1; i <= N; i++) {
                //     this.nodes.push(new Node(i));
                // }

                // for (let i = 1; i <= N; i++) {
                //     for (let m = 2; i * m <= N; m++) {
                //         /** increasing connections toll on connecting nodes */
                //         this.nodes[getIndex(i)].linkCount++;
                //         this.nodes[getIndex(i * m)].linkCount++;

                //         /** connecting the nodes before starting the simulation */
                //         this.links.push(new Link(i, i * m));
                //     }
                // }
                let nodes: Node[] = [];
                this.res = response.aggregations.nodes.buckets;
                for (let node of this.res) {
                    nodes.push(new Node(node.key));
                }
                let nodeIter = 0;
                for (let node of this.res) {
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
        let nodeIndex = this.res.findIndex(function (item, i) {
            return item.key === key
        });
        let links: Link[] = [];

        for (let edge of this.res[nodeIndex].edges.buckets) {
            if (edge.key !== key) {
                links.push(new Link(key, edge.key));
            }
        }
        this.links = links;
    }
}
