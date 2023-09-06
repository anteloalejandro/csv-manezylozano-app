import { Component, Input } from '@angular/core';


export type DropdownItem = {
  id: number;
  value: string;
}


@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent {

  @Input() elements: DropdownItem[] = []
  @Input() label: string = '';


  changeHandler() {

  }
}
