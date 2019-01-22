import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, EventEmitter, OnChanges, Output } from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';

@Component({
    selector: 'graph',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height">
      <g [zoomableOf]="svg">
        <g [linkVisual]="link" *ngFor="let link of links"></g>
        <g [nodeVisual]="node" (click)=openLinks(node.id) *ngFor="let node of nodes"
            [draggableNode]="node" [draggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
    styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnChanges {
    @Input('nodes') nodes;
    @Input('links') links;
    @Output() nodeClicked = new EventEmitter();
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
        return this._options = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    openLinks(key){
        this.nodeClicked.emit(key);
    }
}
