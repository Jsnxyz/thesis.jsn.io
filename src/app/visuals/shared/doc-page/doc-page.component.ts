import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocPresentationInterface } from '../../../d3/models/doc-presentation';
interface SessionStore {
    // taskCode: number;
    interfaceType:number;
    queryRefineCount: number;
    graphClicks:number;
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
    selector: 'app-doc-page',
    templateUrl: './doc-page.component.html',
    styleUrls: ['./doc-page.component.css']
})
export class DocPageComponent implements OnInit {
    @Input() doc;
    @Output() back = new EventEmitter();
    docformatted = new Map();
    constructor() { }

    ngOnInit() {
        for (let i = 0; i < DocPresentationInterface.length; i++) {
            for (let details of Object.keys(DocPresentationInterface[i])) {
                let innerMap = new Map();
                for (let j = 0; j < DocPresentationInterface[i][details].length; j++) {
                    for (let detail of Object.keys(DocPresentationInterface[i][details][j])) {
                        if (this.doc[detail]) {
                            innerMap.set(detail, this.doc[detail]);
                        }
                    }
                }
                this.docformatted.set(details, innerMap);
            }
        }
        console.log("docformatted", this.docformatted);
    }
    
    backClicked(){
        this.back.emit();
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
