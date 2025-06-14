import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-pointbonif',
  templateUrl: './detail-pointbonif.component.html',
  styleUrls: ['./detail-pointbonif.component.css']
})
export class DetailPointbonifComponent {
  @Input() bonifPoints: any; 

}
