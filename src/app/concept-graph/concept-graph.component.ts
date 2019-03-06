import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
@Component({
    selector: 'app-concept-graph',
    template: `
    <div class="concept-graph"></div>
  `,
    styleUrls: ['./concept-graph.component.css']
})
export class ConceptGraphComponent implements OnInit, OnChanges {
    // data:any = [["My Ántonia",["Women Studies","Poetry & Fiction","Immigration","Biography"]],["O pioneers!",["Women Studies","Poetry & Fiction","England","Agriculture"]],["Hill man",["Poetry & Fiction","Archaeology","Biography","Spirituality"]],["A home in the West, or, Emigration and its consequences",["Immigration","Poetry & Fiction","Women Studies","Humanities"]],["Another burning kingdom",["Poetry & Fiction","Ireland","Travel","Dentistry"]],["The plain sense of things",["Poetry & Fiction","Christianity"]],["Emma, or, The unfortunate attachment",["Women Studies","Poetry & Fiction","British Literature"]],["Debi Chaudhurani, or, the wife who came home",["Women Studies","Poetry & Fiction","Food & Diet","Aeronautics"]],["Ninochka",["Immigration","Poetry & Fiction","French Revolution","Literature"]],["Women in love",["Women Studies","Poetry & Fiction","England","Latin America"]],["The long winter ends",["Poetry & Fiction","History","Photography","Humanities"]],["Small rocks rising",["Women Studies","Poetry & Fiction","Geography","Literature"]],["Brothers under a same sky",["Poetry & Fiction","South East Asia"]],["Immigrant women in the settlement of Missouri",["Women Studies","History","Immigration","Biography"]],["My bird",["Women Studies","Poetry & Fiction","Literature"]],["The man who guarded the bomb",["Immigration","Poetry & Fiction","Spirituality","Biography"]],["Martyrdom street",["Women Studies","Poetry & Fiction","Spirituality"]],["Our lady of the artichokes and other Portuguese-American stories",["Poetry & Fiction","British Literature","Humanities"]],["Death of a department chair",["Geology","Poetry & Fiction","Women Studies","Spirituality"]],["The Count of Monte Cristo",["Poetry & Fiction","England","French Revolution","History"]]]
    @Input() data:any;
    @Output() docIdClicked = new EventEmitter();
    //data:any = [[120, ["like", "call response", "dramatic intro", "has breaks", "male vocalist", "silly", "swing"]], [150, ["brassy", "like", "calm energy", "female vocalist", "swing", "fun"]], [170, ["calm energy", "instrumental", "swing", "like", "happy"]], [140, ["has breaks", "male vocalist", "swing", "piano", "banjo", "chill"]], [160, ["calm energy", "instrumental", "swing", "like", "interesting"]], [140, ["brassy", "like", "energy", "dramatic intro", "male vocalist", "baseball", "swing"]], [170, ["instrumental", "interesting", "high energy", "like", "swing"]], [140, ["instrumental", "energy", "like", "swing"]], [200, ["instrumental", "brassy", "dramatic intro", "like", "swing"]], [160, ["male vocalist", "brassy", "swing", "like", "my favorites"]], [130, ["like", "interesting", "dramatic intro", "male vocalist", "silly", "swing", "gospel"]], [160, ["like", "long intro", "announcer", "energy", "swing", "female vocalist"]], [170, ["instrumental", "swing", "bass", "like"]], [150, ["like", "interesting", "has breaks", "instrumental", "chunky", "swing", "banjo", "trumpet"]], [170, ["like", "has breaks", "male vocalist", "silly", "swing", "banjo"]], [190, ["instrumental", "banjo", "swing"]], [130, ["instrumental", "brassy", "banjo", "like", "swing"]], [160, ["brassy", "like", "energy", "instrumental", "big band", "jam", "swing"]], [150, ["like", "male vocalist", "live", "swing", "piano", "banjo", "chill"]], [150, ["like", "trick ending", "instrumental", "chunky", "swing", "chill"]], [120, ["brassy", "like", "female vocalist", "swing", "chill", "energy buildup"]], [150, ["brassy", "like", "interesting", "instrumental", "swing", "piano"]], [190, ["brassy", "like", "long intro", "energy", "baseball", "swing", "female vocalist"]], [180, ["calm energy", "female vocalist", "live", "like", "swing"]], [200, ["banjo", "like", "long intro", "interesting", "energy", "my favorites", "male vocalist", "silly", "swing", "fun", "balboa"]], [150, ["brassy", "calm energy", "chunky", "instrumental", "old-timey", "live", "swing"]], [160, ["like", "call response", "interesting", "instrumental", "calm energy", "swing"]], [180, ["interesting", "swing", "fast", "male vocalist"]], [150, ["calm energy", "chunky", "swing", "female vocalist", "like"]], [180, ["like", "has breaks", "male vocalist", "chunky", "silly", "swing"]], [140, ["instrumental", "brassy", "dramatic intro", "swing", "chill"]], [150, ["male vocalist", "trumpet", "like", "swing"]], [150, ["instrumental", "energy", "like", "has breaks", "swing"]], [180, ["brassy", "like", "energy", "has breaks", "instrumental", "has calm", "swing"]], [150, ["female vocalist", "swing"]], [170, ["instrumental", "brassy", "energy", "swing"]], [170, ["calm energy", "instrumental", "energy", "like", "swing"]], [190, ["brassy", "like", "instrumental", "high energy", "swing", "trumpet"]], [160, ["male vocalist", "energy", "swing", "old-timey"]], [170, ["like", "oldies", "my favorites", "fast", "male vocalist", "high energy", "swing"]]];
    // transform the data into a useful representation
    // 1 is inner, 2, is outer
    // need: inner, outer, links
    //
    // inner: 
    // links: { inner: outer: }
    outer:any = d3.map();
    inner:any = [];
    links = [];
    outerId = [0];
    color;
    diameter = 960;
    rect_width = 40;
    rect_height = 14;
    link_width = "1px";
    diagonal;
    svg;
    onode;
    inode;
    link;
    constructor() { }

    ngOnInit() {
    }
    ngOnChanges() {
        if(this.data.length < 1){
            return;
        }
        for(let idx = 0; idx < this.data.length; idx++){

            if (this.data[idx] == null)
                return;
        
            let i = { id: 'i' + this.inner.length, name: this.data[idx][0], related_links: [], related_nodes: [], doc_id: this.data[idx][2] };
            i.related_nodes = [i.id];
            this.inner.push(i);
        
            if (!Array.isArray(this.data[idx][1]))
            this.data[idx][1] = [this.data[idx][1]];
        
            //this.data[idx][1].forEach(function (d1) {
            for(let j = 0; j<this.data[idx][1].length; j++){
                let d1 = this.data[idx][1][j];
                let o = this.outer.get(d1);
        
                if (o == null) {
                    o = { name: d1, id: 'o' + this.outerId[0], related_links: [], related_nodes: [] };
                    o.related_nodes = [o.id];
                    this.outerId[0] = this.outerId[0] + 1;
        
                    this.outer.set(d1, o);
                }
        
                // create the links
                let l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
                this.links.push(l);
        
                // and the relationships
                i.related_nodes.push(o.id);
                i.related_links.push(l.id);
                o.related_nodes.push(i.id);
                o.related_links.push(l.id);
            };
        }
        this.data = {
            inner: this.inner,
            outer: this.outer.values(),
            links: this.links
        }
        // sort the data -- TODO: have multiple sort options
        this.outer = this.data.outer;
        this.data.outer = Array(this.outer.length);
        var i1 = 0;
        var i2 = this.outer.length - 1;
        for (var i = 0; i < this.data.outer.length; ++i) {
            if (i % 2 == 1)
                this.data.outer[i2--] = this.outer[i];
            else
                this.data.outer[i1++] = this.outer[i];
        }
        console.log(this.data.outer.reduce(function (a, b) { return a + b.related_links.length; }, 0) / this.data.outer.length);
        var il = this.data.inner.length;
        var ol = this.data.outer.length;
        const cw = document.querySelector('.explore_section').clientWidth;
        const ch = document.querySelector('.explore_section').clientHeight;
        this.diameter = cw > ch ? cw : ch;
        this.diameter -= 10;
        // this.diameter = this.diameter > 0 ? this.diameter : 
        var inner_y = d3.scaleLinear()
            .domain([0, il])
            .range([-(il * this.rect_height) / 2, (il * this.rect_height) / 2]);
        let mid = (this.data.outer.length / 2.0)
        var outer_x = d3.scaleLinear()
            .domain([0, mid, mid, this.data.outer.length])
            .range([15, 170, 190, 355]);
        var outer_y = d3.scaleLinear()
            .domain([0, this.data.outer.length])
            .range([0, this.diameter / 2 - 120]);
        // setup positioning
        const diameter = this.diameter / 3;
        this.data.outer = this.data.outer.map(function (d, i) {
            d.x = outer_x(i);
            d.y = diameter;
            return d;
        });
        const rect_width = -(this.rect_width / 2);
        this.data.inner = this.data.inner.map(function (d, i) {
            d.x = rect_width;
            d.y = inner_y(i);
            return d;
        });
        this.diagonal = d3.linkVertical()
        .source((d:any) => {
            //console.log([d.outer.y * Math.cos(this.projectX(d.outer.x)), -d.outer.y * Math.sin(this.projectX(d.outer.x))])
            return [
                -d.outer.y * Math.sin(this.projectX(d.outer.x)), d.outer.y * Math.cos(this.projectX(d.outer.x))
            ];
        })
        .target((d:any) => {
            // let nameLen = d.inner.name.length;
            // const w = (((nameLen * 190)/ 31)/2);
            // return [d.outer.x > 180 ? d.inner.x + 20 - w : d.inner.x + w + 20 , d.inner.y + this.rect_height / 2];
            return [d.outer.x > 180 ? d.inner.x : d.inner.x + 40 , d.inner.y + this.rect_height / 2];
        })
        this.svg = d3.select(".concept-graph").append("svg")
            .attr("width", this.diameter)
            .attr("height", this.diameter)
            .append("g")
            .attr("transform", "translate(" + this.diameter / 2 + "," + this.diameter / 2 + ")");
        
        // links
        const getColor = this.get_color;
        this.link = this.svg.append('g').attr('class', 'links').selectAll(".link")
        .data(this.data.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('id', function (d) { return d.id })
        .attr("d", this.diagonal)
        .attr('stroke', function (d) { console.log(d);return getColor(d.inner.id); })
        .attr('stroke-width', this.link_width);
        // outer nodes
        var onode = this.svg.append('g').selectAll(".outer_node")
        .data(this.data.outer)
        .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("mouseover", this.mouseover)
        .on("mouseout", this.mouseout);

        onode.append("circle")
        .attr('id', function (d) { return d.id })
        .attr("r", 4.5);

        onode.append("circle")
        .attr('r', 20)
        .attr('visibility', 'hidden');

        onode.append("text")
        .attr('id', function (d) { return d.id + '-txt'; })
        .attr("dy", ".31em")
        .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function (d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function (d) { return d.name; });

        // inner nodes
        const docClick = this.docIdClicked;
        var inode = this.svg.append('g').selectAll(".inner_node")
        .data(this.data.inner)
        .enter().append("g")
        .attr("class", "inner_node")
        .attr("transform", function (d, i) { 
            let nameLen = d.name.length;
            const w = -((nameLen * 190)/ 31)/2;
            return "translate(" + w + "," + d.y + ")" 
        })
        .on("mouseover", this.mouseover)
        .on("mouseout", this.mouseout)
        .on("click", function(d) {
            docClick.emit(d.doc_id);
        });

        inode.append('rect')
        .attr('width', function(d){
            let nameLen = d.name.length;
            const w = ((nameLen * 190)/ 31);
            return w;
        })
        .attr('height', this.rect_height)
        .attr('id', function (d) { return d.id; })
        .attr('fill', function (d) { 
            return getColor(d.id); 
            //return '#ddd';
        });

        inode.append("text")
        .attr('id', function (d) { return d.id + '-txt'; })
        .attr('text-anchor', 'middle')
        .attr("transform", function(d){
            let nameLen = d.name.length;
            const w = ((nameLen * 190)/ 31)/2;
            return "translate(" + w + ", " + 14 * .75 + ")"
        })
        .text(function (d) { return d.name; });
        // need to specify x/y/etc
        d3.select(self.frameElement).style("height", this.diameter - 150 + "px");
    }


// from d3 colorbrewer: 
// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).


    get_color(id) {
        id = parseInt(id.replace("i",""));
        const colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#abd9e9", "#74add1", "#4575b4", "#313695"]
        let color = d3.scaleLinear()
            .domain([0, 19])
            .range([colors.length - 1, 0])
            .clamp(true);
        var c = Math.round(color(id));
        if (isNaN(c))
            return '#dddddd';	// fallback color
        return colors[c];
    }
    // Can't just use d3.svg.diagonal because one edge is in normal space, the
    // other edge is in radial space. Since we can't just ask d3 to do projection
    // of a single point, do it ourselves the same way d3 would do it.  
    projectX(x) {
        return ((x - 90) / 180 * Math.PI) - (Math.PI / 2);
    }
    mouseover(d) {
        // bring to front
        d3.selectAll('.links .link').sort(function (a:any, b) { return d.related_links.indexOf(a.id); });

        for (var i = 0; i < d.related_nodes.length; i++) {
            d3.select('#' + d.related_nodes[i]).classed('highlight', true);
            d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');
        }

        for (var i = 0; i < d.related_links.length; i++)
            d3.select('#' + d.related_links[i]).attr('stroke-width', '5px');
    }
    mouseout(d) {
        for (var i = 0; i < d.related_nodes.length; i++) {
            d3.select('#' + d.related_nodes[i]).classed('highlight', false);
            d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal');
        }

        for (var i = 0; i < d.related_links.length; i++)
            d3.select('#' + d.related_links[i]).attr('stroke-width', this.link_width);
    }
}
