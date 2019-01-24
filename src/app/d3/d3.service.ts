import { Injectable, EventEmitter } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from './models';
import * as d3 from 'd3';

@Injectable()
export class D3Service {
    /** This service will provide methods to enable user interaction with elements
      * while maintaining the d3 simulations physics
      */
    constructor() { }

    /** A method to bind a pan and zoom behaviour to an svg element */
    applyZoomableBehaviour(svgElement, containerElement) {
        let svg, container, zoomed, zoom;

        svg = d3.select(svgElement);
        container = d3.select(containerElement);

        zoomed = () => {
            const transform = d3.event.transform;
            container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
        }

        zoom = d3.zoom().on('zoom', zoomed);
        svg.call(zoom);
    }

    /** A method to bind a draggable behaviour to an svg element */
    applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
        const d3element = d3.select(element);

        function started() {
            /** Preventing propagation of dragstart to parent elements */
            d3.event.sourceEvent.stopPropagation();

            if (!d3.event.active) {
                graph.simulation.alphaTarget(0.3).restart();
            }

            d3.event.on('drag', dragged).on('end', ended);

            function dragged() {
                node.fx = d3.event.x;
                node.fy = d3.event.y;
            }

            function ended() {
                if (!d3.event.active) {
                    graph.simulation.alphaTarget(0);
                }

                node.fx = null;
                node.fy = null;
            }
        }

        d3element.call(d3.drag()
            .on('start', started));
    }
    highlightLink(link: Link,element ) {
        const d3element = d3.select(element);
        const div = d3.select(".tooltip");
        function hovered() {
            /** Preventing propagation of dragstart to parent elements */
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(`Click to see documents of ${link.source.id} and ${link.target.id}`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }
        function blurred(){
            div.transition().duration(0).style("opacity",0);
        }
        d3element.on("mouseover",hovered);
        d3element.on("mouseleave",blurred);
    }
    /** The interactable graph we will simulate in this article
    * This method does not interact with the document, purely physical calculations with d3
    */
    getForceDirectedGraph(nodes: Node[], links: Link[], options: { width, height }) {
        const sg = new ForceDirectedGraph(nodes, links, options);
        return sg;
    }
}
