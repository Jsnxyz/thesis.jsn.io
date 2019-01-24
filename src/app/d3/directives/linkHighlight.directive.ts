import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { D3Service } from '../d3.service';
import { Link } from '../models';
@Directive({
    selector: '[linkHover]'
})
export class LinkHighlightDirective implements OnInit {
    @Input('linkHover') linkHover: Link;

    constructor(private d3Service: D3Service, private _element: ElementRef) {}

    ngOnInit() {
        this.d3Service.highlightLink(this.linkHover, this._element.nativeElement);
    }
}
