import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocPresentationInterface } from '../../d3/models/doc-presentation';
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
    }
    
    backClicked(){
        this.back.emit();
    }
}
