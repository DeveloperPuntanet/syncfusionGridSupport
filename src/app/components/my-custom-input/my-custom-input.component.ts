import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-custom-input',
  templateUrl: './my-custom-input.component.html',
  styleUrls: ['./my-custom-input.component.scss'],
})
export class MyCustomInputComponent implements OnInit, OnChanges { 
  @Input() listItems: any[]; //Lista degli elementi da visualizzare
  @Input() searchOn: string; //Proprietà sulla quale effettuare la ricerca degli elementi
  @Input() setItem: any; //Serve per bindare dal componente padre il contenuto dell'input  
  @Input() secondParameter:string=null; //seconda proprietà opzionale che può essere passata
  @Input() secondParameterShowFirst:boolean; //mi serve a capire se il secondo parametro deve essere visualizzato prima o dopo il 'searchOn'  

  @Output() itemSelected: EventEmitter<any> = new EventEmitter(); //Conterrà l'elemento selezionato

  inputCtrl:FormControl=new FormControl();
  selectedItem:any;  
  
  constructor() { }

  ngOnInit() {  
  }
  ngOnChanges(changes: SimpleChanges) {    
  }
  onChange(event){    
  }
  choosedItem(event){
    
  }  
}
