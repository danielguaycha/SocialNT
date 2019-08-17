import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';

@Component({
    selector: 'spiner',
    templateUrl: './spiner.component.html',
    styleUrls: ['./spiner.component.css']
})
export class SpinerComponent implements OnInit {
    @Input() loader: boolean;
    @Input() message: string;
    constructor() {}

    ngOnInit(): void {
        this.message = 'Espere...';
     }
}
