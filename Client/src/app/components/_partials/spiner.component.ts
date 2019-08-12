import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';

@Component({
    selector: 'spiner',
    templateUrl: './spiner.component.html',
    styleUrls: ['./spiner.component.css']
})
export class SpinerComponent implements OnInit, OnChanges {
    @Input() loader: boolean;
    @Input() message: string;
    constructor() {}

    ngOnInit(): void {
        this.message = 'Espere...';
     }

    ngOnChanges(changes: SimpleChanges): void {
        this.loader = changes.loader.currentValue;
    }
}
