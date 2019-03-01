import { EventEmitter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';

const FORCES = {
    LINKS: 1 / 50,
    COLLISION: 1,
    CHARGE: -1
}

export class ForceSimulator {
    public simulator: d3.Simulation<any, any>;

    private n: Node[] = [];
    private l: Link[] = [];

    constructor(nodes, links, options: { width, height }) {
        this.n = nodes;
        this.l = links;

        this.simulator = this.makeSimulation(options);
    }

    // connectNodes(source, target) {
    //     let link;

    //     if (!this.nodes[source] || !this.nodes[target]) {
    //         throw new Error('One of the nodes does not exist');
    //     }

    //     link = new Link(source, target);
    //     this.simulation.stop();
    //     this.links.push(link);
    //     this.simulation.alphaTarget(0.3).restart();

    //     this.initLinks();
    // }

    initNodes(nodes?) {
        if (!this.simulator) {
            throw new Error('simulation was not initialized yet');
        }
        this.n = nodes || this.n;
        this.simulator.nodes(this.n);
    }

    initLinks(links?) {
        if (!this.simulator) {
            throw new Error('simulation was not initialized yet');
        }
        this.l = links || this.l;
        this.simulator.force('links',
            d3.forceLink(this.l)
                .id(d => d['id'])
                .strength(FORCES.LINKS)
        );
    }

    makeSimulation(options) {
        let sim;
        if (!options || !options.width || !options.height) {
            throw new Error('missing options when initializing simulation');
        }

        /** Creating the simulation */
        if (!this.simulator) {

            sim = d3.forceSimulation()
                .force('charge',
                    d3.forceManyBody()
                        .strength(d => FORCES.CHARGE * d['r'])
                )
                .force('collide',
                    d3.forceCollide()
                        .strength(FORCES.COLLISION)
                        .radius(d => d['r'] + 5).iterations(0)
                );
            // Connecting the d3 ticker to an angular event emitter

            sim.nodes(this.n);
            sim.force('links',
                d3.forceLink(this.l)
                    .id(d => d['id'])
                    .strength(FORCES.LINKS)
                );
        }

        /** Updating the central force of the simulation */
        sim.force('centers', d3.forceCenter(options.width / 2, options.height / 2));

        /** Restarting the simulation internal timer */
        sim.restart().stop();
        sim.alpha(1);
        for (var i = 0, n = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 -sim.alphaDecay())); i < n; ++i) {
            sim.tick();
        }
        return sim;
    }

    public getNodes() {
        return this.n;
    }
    public getLinks() {
        return this.l;
    }
}
