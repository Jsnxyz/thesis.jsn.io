import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, EventEmitter, OnChanges, Output, ViewChild } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node, Link } from '../../d3';
import * as d3 from 'd3';

@Component({
    selector: 'graph',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    @Input('nodes') nodes:Node[];
    @Input('links') links:Link[];
    @Output() nodeClicked = new EventEmitter();
    @Output() linkClicked = new EventEmitter();
    @ViewChild('svg') svg;
    graph: ForceDirectedGraph;
    _options: { width, height } = { width: 800, height: 600 };

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.graph.initSimulation(this.options);
    }


    constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) { }

    ngOnInit() {
        
    }
    ngOnChanges() {
        if (this.nodes.length > 0) {
            this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
            this.graph.ticker.subscribe((d) => {
                this.ref.markForCheck();
            });
        }
    }

    get options() {
        let element = document.querySelector(".explore_section");
        return this._options = {
            width: element.clientWidth,
            height: element.clientHeight
        };
    }
    openLinks(key, event){
        if (event.ctrlKey)
        {
            console.log("Ctrl Clicked");
            return;
        }
        this.nodeClicked.emit(key);
    }
    openConnectingLink(link){
        this.linkClicked.emit(link);
    }

}
