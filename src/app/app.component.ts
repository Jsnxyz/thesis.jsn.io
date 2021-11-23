import { Component, OnInit } from '@angular/core';
import { Node, Link } from './d3';
import { Client } from 'elasticsearch-browser';
import { SearchService } from './search.service';
import { Observable } from 'rxjs';
import * as d3 from 'd3';

interface Facets {
    Subjects?: any;
    Publication_Year?: any;
    Publisher_Name?: any;
    Contributors?: any;
    Topics?: any;
}
interface SessionStore {
    // taskCode: number;
    interfaceType:number;
    queryRefineCount: number;
    graphClicks:number;
    conceptGraphClicks:number;
    Topics:number;
    Subjects:number;
    Publication_Year: number;
    Publisher_Name:number;
    Contributors:number;
    timeStart: number;
    timeEnd:number;
    timeTaken: number;
    DocsPicked: string[];
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    nodes: Node[] = [];
    links: Link[] = [];
    oldNodes:Node[] = [];

    realLinks: Link[] = [];
    client: Client;
    graphResults: any = [];
    docResults: any = [];
    searchBoxText: string = "";
    savedSearchText: string = "";
    facets: Facets = {};
    selectedFacets: Facets = {};
    totalDocs = 0;
    currentPage = 1;

    resultPageToggle = false;
    openedDoc:any;

    topicNodeInput:string;
    topicList: string[] = [];
    showTopicList = false;
    centerNode = "";

    mouseClick = Observable.fromEvent(document, 'click');
    clickSubscription;

    showFilter = false;

    showMoreFacets = false;
    moreFacets: Facets = {};
    selectedMoreFacets: Facets = {};
    mltResults = [];

    interfaceType = 0;

    //Session related 
    taskCode = "";
    activeTask = "";
    getKeys(object: {}) {
        return Object.keys(object);
    }
    constructor(private es: SearchService) {
    }
    ngOnInit() {

        // Change this to fit sessions.
        this.activeTask = window.sessionStorage.getItem("active");
        if(this.activeTask) {
            this.taskCode = this.activeTask;
            this.sessionResume();
        }
        this.getGraphAndDocs("");        
        this.clickSubscription = this.mouseClick.subscribe((evt: MouseEvent) => {
            let element:any = evt.srcElement;
            if (element) {
                if (!(element.closest('.selectBox') !== null || element.classList.contains(".selectBox"))) {
                    this.closeDropDowns();
                }
            }
        });
    }
    toUnique(a, b?, c?) { //array,placeholder,placeholder
        b = a.length;
        while (c = --b)
          while (c--) a[b].key !== a[c].key || a.splice(c, 1);
        return a // not needed ;)
    }
    removeUnderscore(text) {
        return text.replace("_", " ");
    }
    loadFacets(aggs) {
        if(!(this.selectedFacets.Contributors && this.selectedFacets.Contributors.length > 0))
            this.facets.Contributors = {items : aggs.contributors_facet ? aggs.contributors_facet.buckets : [], count:aggs.contributors_facet.sum_other_doc_count || 0 };
        if(!(this.selectedFacets.Subjects && this.selectedFacets.Subjects.length > 0))
            this.facets.Subjects = {items: aggs.subject_facet ? aggs.subject_facet.buckets : [], count:aggs.subject_facet.sum_other_doc_count || 0 };
        if(this.interfaceType == 1 && !(this.selectedFacets.Topics && this.selectedFacets.Topics.length > 0)){
            let nodes = aggs.nodes;
            this.facets.Topics = {items: nodes ? nodes.buckets.slice(0,5) : [], count:nodes.sum_other_doc_count || 0 };
        }
        if(!(this.selectedFacets.Publisher_Name && this.selectedFacets.Publisher_Name.length > 0))
            this.facets.Publisher_Name = {items: aggs.publisher_facet ? aggs.publisher_facet.buckets : [], count:aggs.publisher_facet.sum_other_doc_count || 0};
        if(!(this.selectedFacets.Publication_Year && this.selectedFacets.Publication_Year.length > 0))
            this.facets.Publication_Year= {items: aggs.publication_year_facet ? aggs.publication_year_facet.buckets : [], count:aggs.publication_year_facet.sum_other_doc_count || 0 };

            
    }

    openLinks(key) {
        if(this.interfaceType == 1){
            return;
        }
        let nodeIndex = this.graphResults.findIndex(function (item, i) {
            return item.key === key
        });
        let links: Link[] = [];
        for(let i=0;i<this.nodes.length; i++){
            this.nodes[i].active = false;
        }
        this.nodes[nodeIndex].active = true;
        if(this.graphResults[nodeIndex]){
            let max = 0;
            for (let edge of this.graphResults[nodeIndex].edges.buckets) {
                if (edge.doc_count > max && edge.key !== key) {
                    max = edge.doc_count;
                }
            }
            let newNodes = [];
            for (let edge of this.graphResults[nodeIndex].edges.buckets) {
                if (edge.key !== key) {
                    //get node index and update maxCount and linkCount
                    let nodeIndex = this.nodes.findIndex(function (item, i) {
                        return item.id === edge.key
                    });
                    newNodes.push(new Node(edge.key, edge.doc_count, max));
                    links.push(new Link(key, edge.key,edge.doc_count,max));
                } else {
                    newNodes.push(new Node(edge.key,edge.doc_count,edge.doc_count));
                }
            }
            this.links = [];
            this.oldNodes = this.nodes;
            this.nodes = newNodes;            
            setTimeout(() => {
                this.links = links;
            },1000)
            
            this.getResultByTopics(key, this.searchBoxText);
        }
        //Enter Session Here
        this.editSessionObject('graphClicks');
    }
    //getNetwork
    getGraphAndDocs(text) {
        if(text){
            //Enter Session Here
            this.editSessionObject('queryRefineCount');
        }
        this.savedSearchText = text;
        this.selectedFacets = {};
        this.getNetwork(text);
        this.getResultDocs(text);
        this.resultPageToggle = false;
    }
    getNetwork(text) {
        this.links = [];
        let facets = Object.assign({}, this.selectedFacets);
        let topicName:string;
        if(this.selectedFacets.Topics && this.selectedFacets.Topics[0]){
            topicName = this.selectedFacets.Topics[0];
        }
        facets.Topics = [];
        this.es.searchGraph(text, this.selectedFacets)
            .then(response => {
                this.graphUpdate(response,true);
            }, error => {
                console.error(error);
            }).then(() => {
                setTimeout(() => {
                    if(topicName){
                        this.openLinks(topicName);
                    }
                },1000)
            });
    }
    getNetworkWithoutFacetUpdate(text){
        let facets = Object.assign({}, this.selectedFacets);
        let topicName:string;
        if(this.selectedFacets.Topics && this.selectedFacets.Topics[0]){
            topicName = this.selectedFacets.Topics[0];
        }
        facets.Topics = [];
        this.es.getGraphNoFacetUpdate(text, facets)
            .then(response => {
                this.links = [];
                this.graphUpdate(response,false);
            }, error => {
                console.error(error);
            }).then(() => {
                setTimeout(() => {
                    if(topicName){
                        this.openLinks(topicName);
                    }
                },1000)
                
            });
        
    }
    graphUpdate(response, loadFacet) {
        const N = response.aggregations.nodes.buckets.length,
            getIndex = number => number - 1;
        let nodes: Node[] = [];
        this.graphResults = response.aggregations.nodes.buckets;
        if(loadFacet){
            this.loadFacets(response.aggregations);
        }
        let max = 0;
        this.graphResults.forEach(element => {
            if (element.doc_count > max) {
                max = element.doc_count;
            }
        });
        this.topicList = [];
        for (let node of this.graphResults) {
            nodes.push(new Node(node.key,node.doc_count, max));
            this.topicList.push(node.key);
        }
        this.oldNodes = this.nodes;
        this.nodes = nodes;
    }
    //get facets and hits. 
    getResultDocs(text,pageNo = 1) {
        this.currentPage = pageNo;
        this.es.getDocuments(text, this.selectedFacets,pageNo)
            .then(response => {
                this.docResults = response.hits.hits;
                this.totalDocs = response.hits.total;
            }, error => {
                console.error(error);
            }).then(() => {
            });
    }
    getResultByTopics(topic, text) {
        text = text || "";
        this.selectedFacets.Topics = [topic];
        this.es.getDocuments(text, this.selectedFacets, undefined, true)
            .then(response => {
                this.docResults = response.hits.hits;
                this.totalDocs = response.hits.total;
                this.loadFacets(response.aggregations);
            }, error => {
                console.error(error);
            }).then(() => {
            });
    }
    limitText(text: any) {
        text = text.toString();
        if (text.length > 150) {
            text = text.toString().substr(0, 150) + " ..";
        } else {
            text = text.toString().substr(0, 150)
        }
        return text;
    }
    getUnique(arr) {
        return Array.from(new Set(arr));
    }
    facetClick(event, facet, facetKey) {
        if (event.target.checked) {
            this.selectedFacets[facet] = this.selectedFacets[facet] || [];
            this.selectedFacets[facet].push(facetKey);
            //Enter Session Here
            this.editSessionObject(facet);
        } else {
            const facetKeyIndex = this.selectedFacets[facet].findIndex(function (item, i) {
                return item === facetKey
            });
            this.selectedFacets[facet].splice(facetKeyIndex, 1);
        }
        //this.getNetworkWithoutFacetUpdate(this.savedSearchText);
        this.getNetwork(this.savedSearchText);
        this.getResultDocs(this.savedSearchText);
    }
    openDocsBySingleFacet(facet, facetKey) {
        // Reset searchText, load facets, and change selectedFacet as the given params. And then search. 
        this.selectedFacets = {};
        this.selectedFacets[facet] = [facetKey];
        this.getNetwork(this.savedSearchText);
        this.getResultDocs(this.savedSearchText);
        //Enter Session Here
        this.editSessionObject(facet);
    }
    openConnectingTopics(link){
        // remove non source topic
        this.selectedFacets['Topics'].splice(1,this.selectedFacets['Topics'].length - 1);
        this.selectedFacets['Topics'].push(link.target.id);
        this.getResultDocs(this.savedSearchText);
        //Enter Session Here
        this.editSessionObject('graphClicks');
    }
    moreFacetClick(event, facet, facetKey){
        if (event.target.checked) {
            this.selectedMoreFacets[facet] = this.selectedMoreFacets[facet] || [];
            this.selectedMoreFacets[facet].push(facetKey);
            //Enter Session Here
            this.editSessionObject(facet);
        } else {
            const facetKeyIndex = this.selectedMoreFacets[facet].findIndex(function (item, i) {
                return item === facetKey
            });
            this.selectedMoreFacets[facet].splice(facetKeyIndex, 1);
        }
    }
    addFilters(){
        this.selectedFacets = Object.assign({},this.selectedMoreFacets);
        this.getNetwork(this.savedSearchText);
        this.getResultDocs(this.savedSearchText);
        this.showMoreFacets = false;
    }
    paginateClick(pageNo){
        this.currentPage = pageNo;
        const scrollElement = document.querySelector('.results_section_wrapper');
        scrollElement.scrollTop = 0;
        this.getResultDocs(this.savedSearchText,pageNo);
    }
    openDoc(id,getMLT = true){
        this.openedDoc = null;
        if(getMLT){
            this.getMLT(id);
        }
        this.es.getDocument(id)
            .then(response => {
                this.openedDoc = response._source;
                this.openedDoc["_id"] = response._id;
                this.resultPageToggle = true;
            }, error => {
                console.error(error);
            }).then(() => {
            });
    }
    getMLT(id){
        this.es.getMLTById(id).then(response => {
            let results = response.hits.hits;
            let nodes:Node[] = [];
            let links:Link[] = [];
            let topics = {};
            let arr = [];
            // Creates Nodes
            for(let i = 0; i < results.length ; i++) {
                let outerArray = [];
                let innerArray = [];
                if(results[i]._source["Main Title"]) 
                    outerArray.push(results[i]._source["Main Title"][0]);
                else {
                    outerArray.push(results[i]._source["Title"][0]);
                }
                    
                for(let topic of results[i]._source.Topics){
                    innerArray.push(topic);
                    
                }
                outerArray.push(innerArray);
                outerArray.push(results[i]._id);
                arr.push(outerArray);
                
            }
            this.mltResults = arr;
        }, error => {

        }).then(()=>{

        });
    }
    goBackToDocs(){
        this.resultPageToggle = false;
        this.mltResults = [];
    }
    filterByTopicInput(){
        if(this.topicNodeInput){
            return this.topicList.filter( (item) => {
                if(item.toLowerCase().includes(this.topicNodeInput.toLowerCase())){
                    return true;
                }
                return false;
            })
        } 
        return this.topicList;
    }
    toggleTopicList(){
        this.showTopicList = !this.showTopicList;
    }
    delayToggleTopicList(){
        setTimeout(() => {
            this.showTopicList = false;
        },100);
    }
    centerTopic(topic:string){
        let nodeIndex = this.graphResults.findIndex(function (item, i) {
            return item.key === topic
        });
        let graphElement = document.querySelector("graph");
        let graph = d3.select(graphElement);
        let node = this.nodes[nodeIndex];
        let svgElement = document.querySelector('.mainGraphSvg');
        let containerElement = document.querySelector('.mainGraphContainer');
        
        let svg = d3.select(svgElement);
        let container = d3.select(containerElement);
        const t = d3.zoomTransform(graph.node());
        let x = -Number(node.x);
        let y = -Number(node.y);
        x = x * t.k + (svgElement.clientWidth / 2);
        y = y * t.k + (svgElement.clientHeight / 2);
        let zoomed = () => {
            if(d3.event.transform != null) {
                container.attr("transform", d3.event.transform );
            }
        }
    
        let zoom = d3.zoom().on('zoom', zoomed);
        svg.transition().duration(750).call( zoom.transform, d3.zoomIdentity.translate(x,y).scale(t.k) );
    }
    getMoreFacetItems(facet) {
        this.selectedMoreFacets = Object.assign({}, this.selectedFacets);
        const facets = Object.assign({},this.selectedFacets);
        this.es.getMoreFacets(this.savedSearchText, this.removeUnderscore(facet), facets )
        .then(response => {
            this.moreFacets = {};
            const aggs = response.aggregations;
            this.moreFacets[facet] = {items : aggs.facets ? aggs.facets.buckets : [], count:aggs.facets.sum_other_doc_count || 0 };
        }, error => {
            console.error(error);
        }).then(() => {
            this.showMoreFacets = true;
        });

    }
    isChecked(facet,facetKey){
        if(this.selectedFacets[facet]){
            if(this.selectedFacets[facet].indexOf(facetKey) > -1) {
                return true;
            }
        }
        return false;
    }
    openSelectedFilterDropDown(item) {
        let element = document.querySelector('.selectItems.sB' + item);
        if(element.classList.contains('show')){
            element.classList.remove('show'); 
        } else {
            element.classList.add('show'); 
        }
    }
    closeDropDowns() {
        let elements = document.querySelectorAll('.selectItems');
        for(let i = 0; i < elements.length; i++ ){
            if(elements[i].classList.contains('show')){
                elements[i].classList.remove('show'); 
            }
        }
    }
    removeFilter(facet, facetValue){
        const facetKeyIndex = this.selectedFacets[facet].findIndex(function (item, i) {
            return item === facetValue
        });
        this.selectedFacets[facet].splice(facetKeyIndex, 1);
        this.getNetwork(this.savedSearchText);
        this.getResultDocs(this.savedSearchText);
    }
    setNodes(nodes){
        this.nodes = nodes;
    }
    textualInterface() {
        this.interfaceType = 1;
        this.clearVariables();
        this.getGraphAndDocs(this.savedSearchText);        
    }
    graphicalInterface() {
        this.interfaceType = 2;
        this.clearVariables();
        this.getGraphAndDocs(this.savedSearchText);
    }
    clearVariables() {
        this.nodes = [];
        this.links = [];
        this.oldNodes = [];
        this.docResults = [];
        this.facets = {};
        this.selectedFacets = {};
        this.searchBoxText = "";
        this.savedSearchText = "";
    }
    initializeSession():SessionStore {
        let storeObj: SessionStore =  {
            interfaceType: this.interfaceType,
            queryRefineCount: 0,
            graphClicks:0,
            conceptGraphClicks: 0,
            Topics:0,
            Subjects:0,
            Publication_Year: 0,
            Publisher_Name:0,
            Contributors:0,
            timeStart: new Date().getTime(),
            timeEnd:0,
            timeTaken: 0,
            DocsPicked: []
        }
        return storeObj;
    }
    sessionStart() {
        if(!this.taskCode) this.graphicalInterface();
        if(this.taskCode == 'T') {
            this.textualInterface();
            return;
        }
        if(this.taskCode == 'V') {
            this.graphicalInterface();
            return;
        }
        if(this.taskCode.startsWith('t')){
            this.textualInterface();
        } else if(this.taskCode.startsWith('v')){
            this.graphicalInterface();
        }
        if(window.sessionStorage.getItem(this.taskCode)){
            alert("This task is already done.");
            return;
        }
        let storeObj = this.initializeSession();
        window.sessionStorage.setItem("active",this.taskCode);
        window.sessionStorage.setItem(this.taskCode,JSON.stringify(storeObj));
        this.activeTask = this.taskCode;
    }
    sessionResume(){
        if(this.activeTask.startsWith('t')){
            this.textualInterface();
        } else if(this.activeTask.startsWith('v')){
            this.graphicalInterface();
        }
    }
    sessionEnd() {
        let activeTask = window.sessionStorage.getItem("active");
        if(activeTask){
            let storeObj = JSON.parse(window.sessionStorage.getItem(activeTask));
            storeObj.timeEnd = new Date().getTime();
            storeObj.timeTaken = (storeObj.timeEnd - storeObj.timeStart)/1000;
            window.sessionStorage.setItem(activeTask,JSON.stringify(storeObj));
            window.sessionStorage.removeItem("active");
            this.activeTask = null;
            this.taskCode = "";
        }
        
    }
    getSessionObject(){
        let activeTask = window.sessionStorage.getItem("active");
        if(activeTask){
            let storeObj = JSON.parse(window.sessionStorage.getItem(activeTask));
            return storeObj;
        }
        return null;
    }
    editSessionObject(field) {
        let activeTask = window.sessionStorage.getItem("active");
        if(activeTask){
            let storeObj = JSON.parse(window.sessionStorage.getItem(activeTask));
            storeObj[field] += 1;
            window.sessionStorage.setItem(activeTask,JSON.stringify(storeObj));
        }
    }
    itemInBookmark(id:string){
        let activeTask = window.sessionStorage.getItem("active");
        if(activeTask){
            let storeObj:SessionStore = JSON.parse(window.sessionStorage.getItem(activeTask));
            if(storeObj.DocsPicked.indexOf(id) > -1){
                return true;
            }
        }
        return false;
    }
    conceptClickLog() {
        this.editSessionObject('conceptGraphClicks');
    }
    editSessionDoc(id:string, event:any){
        event.stopPropagation();
        let activeTask = window.sessionStorage.getItem("active");
        if(activeTask){
            let storeObj:SessionStore = JSON.parse(window.sessionStorage.getItem(activeTask));
            let index = storeObj.DocsPicked.indexOf(id);
            if(index > -1){
                storeObj.DocsPicked.splice(index,1);
            } else {
                storeObj.DocsPicked.push(id);
            }
            window.sessionStorage.setItem(activeTask,JSON.stringify(storeObj));
        }
    }
}
