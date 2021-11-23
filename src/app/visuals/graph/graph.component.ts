import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, SimpleChange, EventEmitter, OnChanges, Output, ViewChild } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link, ForceSimulator } from '../../d3';
import * as d3 from 'd3';

@Component({
    selector: 'graph',
    template: `
    <svg #svg class="mainGraphSvg" [attr.width]="_options.width" [attr.height]="_options.height">
      <g class="mainGraphContainer" [zoomableOf]="svg">
        <g class="svgLinks" (click)="openConnectingLink(link)" [linkHover]="link" [linkVisual]="link" *ngFor="let link of links"></g>
        <g class="svgNodes" [nodeVisual]="node" (click)="openLinks(node.id, $event)" *ngFor="let node of nodes"
            [draggableNode]="node" [draggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
    styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {
    @Input('nodes') nodes: Node[];
    @Input('links') links: Link[];
    @Input('oldNodes') oldNodes: Node[];
    initialNodes: Node[] = [];
    @Output() nodeClicked = new EventEmitter();
    @Output() linkClicked = new EventEmitter();
    @Output() nodesChanged = new EventEmitter();
    @Output() linksChanged = new EventEmitter();
    @ViewChild('svg') svg;
    graph: ForceDirectedGraph;
    _options: { width, height } = { width: 800, height: 600 };

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.graph.initSimulation(this.options);
    }


    constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.nodes.length > 0 && this.oldNodes.length === 0) {
            this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
            this.initialNodes = this.nodes;
            this.graph.ticker.subscribe((d) => {
                //this.ref.markForCheck();
            });
        }
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        
        if (changes.hasOwnProperty('oldNodes') && changes.hasOwnProperty('nodes')) {
            if (this.nodes.length > 0 && this.oldNodes.length > 0) {
                // Simulate transition of the graph to new one      
                let newNodes:Node[] = [];
                for (let i = 0; i < this.nodes.length; i++) {
                    newNodes.push(new Node(this.nodes[i].id, this.nodes[i].linkCount, this.nodes[i].maxDocCount))
                }
                this.nodes = Object.assign([], this.initialNodes);
                let graph = new ForceSimulator(newNodes, this.links, this.options);
                graph.simulator.stop();
                graph.simulator.alpha(1);
                for (var i = 0, n = Math.ceil(Math.log(graph.simulator.alphaMin()) / Math.log(1 - graph.simulator.alphaDecay())); i < n; ++i) {
                    graph.simulator.tick();
                }

                const g = d3.select(document.querySelector(".mainGraphSvg")).selectAll('.nodeWrapper');
                g.transition()
                    .duration(1500)
                    .attrTween('bubble-tween-dummy', (arg0, idx, nodeList) => {
                        const id = this.initialNodes[idx].id;
                        const newNodeIndex = newNodes.findIndex(function (item, i) {
                            return item.id === id
                        });
                        if(newNodeIndex > -1) {
                            const iX = d3.interpolate(this.nodes[idx].x, newNodes[newNodeIndex].x);
                            const iY = d3.interpolate(this.nodes[idx].y, newNodes[newNodeIndex].y);
                            const iLC = d3.interpolate(this.nodes[idx].linkCount, newNodes[newNodeIndex].linkCount);
                            const iMDC = d3.interpolate(this.nodes[idx].maxDocCount, newNodes[newNodeIndex].maxDocCount); 
                            return (t) => {
                                this.nodes[idx].x = iX(t);
                                this.nodes[idx].y = iY(t);
                                this.nodes[idx].linkCount = iLC(t);
                                this.nodes[idx].maxDocCount = iMDC(t);
                                return '';
                            };
                        } else {
                            const iLC = d3.interpolate(this.nodes[idx].linkCount, 0);
                            const iMDC = d3.interpolate(this.nodes[idx].maxDocCount, 0); 
                            return (t) => {
                                this.nodes[idx].linkCount = iLC(t);
                                this.nodes[idx].maxDocCount = iMDC(t);
                                return '';
                            };
                        }                        
                    })
                    // when transition is complete
                    .on('end', (arg0, idx, nodeList) => {
                        // when transition is complete for the last item
                        if (idx === nodeList.length - 1) {
                            graph.simulator.force('centers', d3.forceCenter(this.options.width / 2, this.options.height / 2))
                            this.nodesChanged.emit(this.nodes);
                            this.initialNodes = Object.assign([],this.nodes);
                            if(!this.links.length) {
                                let linkElement = document.querySelector('.node.active');
                                if(linkElement) {
                                    linkElement.classList.remove('active');
                                }
                            }
                        }
                    });
                
            }

        }
        if ( changes.hasOwnProperty('links')) {
            if (this.nodes.length > 0) {
                this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
            }
        }
    }
    get options() {
        let element = document.querySelector(".explore_section");
        return this._options = {
            width: element.clientWidth,
            height: element.clientHeight
        };
    }
    openLinks(key, event) {
        if (event.ctrlKey) {
            return;
        }
        this.nodeClicked.emit(key);
    }
    openConnectingLink(link) {
        this.linkClicked.emit(link);
    }

}
