import { Component, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageSettingsModel, EditSettingsModel, ToolbarItems, CommandModel, GridComponent, TextWrapSettingsModel, SaveEventArgs, GridModel, DetailRowService, RowDataBoundEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { Observable } from 'rxjs';
import { BillMaterialsMeasuresDTO } from './models/BillMaterialsMeasuresDTO';
import { BillOfMaterialsCostAnalysisMeauseresDTO } from './models/billOfMaterialsCostAnalysisMeauseresDTO';
import { BillOfMaterialsDTO } from './models/billOfMaterialsDTO';
import { TabUnitMeasureDTO } from './models/tabUnitMeasureDTO';
import { BillOfMaterialsService } from './services/bill-of-materials.service';
import { TabBuildMasterService } from './services/tab-build-master.service';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { debounceTime, find, map, startWith } from 'rxjs/operators';
import { ClickEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import * as math from 'mathjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bill-of-material';

  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('editMeasureDescription', { static: true }) public editMeasureDesc: any; 
  @ViewChild('editMeasureQty', { static: true }) public editMeasureQty: any; 
  @ViewChild('editMeasureWidth', { static: true }) public editMeasureWidth: any; 
  @ViewChild('editMeasureLength', { static: true }) public editMeasureLength: any; 
  @ViewChild('editMeasureHeight', { static: true }) public editMeasureHeight: any; 
  @ViewChild('editMeasureTotalMeasure', { static: true }) public editMeasureTotalMeasure: any; 

  bill: BillMaterialsMeasuresDTO;
  listAllMeasures: any[] = [];
  pageSettings: PageSettingsModel;
  editSettings: EditSettingsModel;
  toolbar: any[];
  commands: CommandModel[];
  sortOptions: object;
  wrapSettings: TextWrapSettingsModel;
  orderData: any;
  tools: object;
  iframe: object;
  addType:string;

  isExpanded:boolean = false;

  //Binding dei campi delle singole voci
  billProgressive: number;
  billDescription: string;
  billCode:string;
  billQty:number;
  billPrice:number;
  billDiscount:number;
  billTotal:number;
  //capitolato a prezzi unitari
  showFieldCPU:boolean = false;  
  billIncLabor:number;
  billIncCharges:number;
  billNetPrice:number;
  billDecrease:number;
  //capitolato a punti
  showFieldPunti:boolean = false;
  billPunti:number;
  billFattValPunti:number;

  selectedMeasuresRow: BillOfMaterialsCostAnalysisMeauseresDTO;
  //binding dei campi delle misure
  measureDesc: string;
  measureQty: number;
  measureWidth: number;
  measureLength: number;
  measureHeight: number;
  measureTotalMeasure: number;
  measureFormula: string;
  showFormula:boolean = false;

  umCtrl:FormControl=new FormControl();
  tabUM:TabUnitMeasureDTO[] = [];
  filteredUm$: Observable<TabUnitMeasureDTO[]>;
  childGrid: any;
  showEditField: boolean = true;
  totalOfBill: number = 0;
  totalOffer: number = 0;
  totalOfIncCharges: number = 0;
  totalOfIncLabor: number = 0;

  //Validation Rules
  progValidationRules:object;
  codeValidationRules: object;
  descriptionValidationRules: object;
  qtyValidationRules: object;
  priceValidationRules: object;
  totalValidationRules: object;

  indexes:any; 
  expandFlag: boolean = false; 
  public fieldName;

  public items: MenuItemModel[] = [
    {
      text: 'Record',
      id: 'newrecord',
    },
  ];

  //Data
  dataBill:BillOfMaterialsDTO[]=[];
  dataMeasures:BillOfMaterialsCostAnalysisMeauseresDTO[]=[];
  myData:BillMaterialsMeasuresDTO=new BillMaterialsMeasuresDTO;

  constructor(@Inject(ViewContainerRef) private viewContainerRef?: ViewContainerRef) {
  }

  async ngOnInit() {
    this.getData();
    

    this.setVociTableSettings();
    this.setMeasuresTableSettings();
    
    
    this.editMeasureQty.elementRef.nativeElement._viewContainerRef = this.viewContainerRef; 
    this.editMeasureQty.elementRef.nativeElement.propName = 'template'; 
    this.editMeasureDesc.elementRef.nativeElement._viewContainerRef = this.viewContainerRef; 
    this.editMeasureDesc.elementRef.nativeElement.propName = 'template'; 
    this.editMeasureWidth.elementRef.nativeElement._viewContainerRef = this.viewContainerRef; 
    this.editMeasureWidth.elementRef.nativeElement.propName = 'template';
    this.editMeasureLength.elementRef.nativeElement._viewContainerRef = this.viewContainerRef; 
    this.editMeasureLength.elementRef.nativeElement.propName = 'template'; 
    this.editMeasureHeight.elementRef.nativeElement._viewContainerRef = this.viewContainerRef; 
    this.editMeasureHeight.elementRef.nativeElement.propName = 'template'; 
    this.editMeasureTotalMeasure.elementRef.nativeElement._viewContainerRef = this.viewContainerRef; 
    this.editMeasureTotalMeasure.elementRef.nativeElement.propName = 'template'; 
  }
  
  async refreshGrid(){
    this.totalOfBill = 0;
    let totCP: number = 0;
    let partialTot: number = 0;

    this.bill.billOfMaterialList.forEach(element => {
      if(element.code == '|TC') {
        element.total = totCP;
        totCP = 0;
      }
      else if(!element.code.includes('|CP') && !element.code.includes('|TP')) {
        totCP = totCP + element.total;
        partialTot += element.total;
      }
      else if(element.code == '|CP') {
        totCP = 0;
      } 
      else if(element.code == '|TP'){
        element.total = partialTot;
      }
      if(!element.code.includes("|CP") && !element.code.includes("|TC") && !element.code.includes("|TP")) {
        this.totalOfBill = this.totalOfBill + element.total;
      }     
    })
    this.grid.refresh();
  }
  setVociTableSettings(){
    this.pageSettings = { pageSize: 10, pageSizes: true };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Bottom', showDeleteConfirmDialog: true };
    this.commands = [{ type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
                     { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
                     { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
                     { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
                    ];
    this.codeValidationRules = { required: true }; 
    this.descriptionValidationRules = { required: true };
    this.qtyValidationRules = { required: true };
    this.priceValidationRules = { required: true };
    this.totalValidationRules = { required: true };
    this.sortOptions = { columns: [{ field: 'progressive', direction: 'Ascending' }] };
    this.wrapSettings = { wrapMode: 'Content' };

    this.tools = {
        items: []
        };
    this.iframe = { enable: true }
  }
  setMeasuresTableSettings(){
    this.childGrid = {
      dataSource: this.myData.billOfMaterialsCostAnalysisMeauseresList,
      queryString: 'billOfMaterialsId',
      columns: [
          { field: 'description', headerText: 'Description', textAlign: 'Left', width: '50%', editTemplate: this.editMeasureDesc },
          { field: 'qty', headerText: 'Qtà',  textAlign: 'Left', width: 20, editTemplate: this.editMeasureQty },
          { field: 'width', headerText: 'Lar', editType:'NumericTextBox', textAlign: 'Left', width: 20, editTemplate: this.editMeasureWidth },
          { field: 'length', headerText: 'Lun', editType:'NumericTextBox', textAlign: 'Left', width: 20, editTemplate: this.editMeasureLength },
          { field: 'height', headerText: 'Alt', editType:'NumericTextBox', textAlign: 'Left', width: 20, editTemplate: this.editMeasureHeight },
          { field: 'totalMeasure', headerText:  'Misura', editType:'NumericTextBox', textAlign: 'Left', width: 20, editTemplate: this.editMeasureTotalMeasure},
          { headerText:'', 
            width:20,
            commands: [
              { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' }},
              { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' }},
              { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' }},
              { type: 'Cancel', buttonOption: { 
                cssClass: 'e-flat', 
                iconCss: 'e-cancel-icon e-icons', 
              }}
            ]
          },          
      ],
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Bottom', showDeleteConfirmDialog: true},
      toolbar: ['Add'],
      load() {                
        localStorage.setItem('parentId', this.parentDetails.parentRowData['billOfMaterialsId']);   
        this.registeredTemplate = {};              
      },      
      actionBegin: (args: SaveEventArgs) => {
        this.measureActionBegin(args);
      },
      allowRowDragAndDrop: true,
      rowDrop: (e) => {
        this.measuresRowDrop(e);
      },
    };
  }
  detailDataBound(args) { 
    var toolbar = args.childGrid.element.querySelector('.e-toolbar'); 
    args.childGrid.element.appendChild(toolbar); 
  }
  async actionBegin(args: SaveEventArgs) {  
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
        this.orderData =  args.rowData;
        this.billProgressive = args.rowData['progressive'];
        this.billDescription = args.rowData['description'];
        this.billCode = args.rowData['code'];
        this.billQty = args.rowData['qty'];
        this.billPrice = args.rowData['price'];
        this.billTotal = args.rowData['total'];
        this.umCtrl.setValue(this.orderData.measureUnit);

        if(this.addType == 'chapter') {
          this.orderData.code = '|CP';
          this.billCode = '|CP';
        }
        else if (this.addType == 'totalchapter'){
          this.orderData.code = '|TC';
          this.billCode = '|TC';
        }
        else if (this.addType == 'partialtotal'){
          this.orderData.code = '|TP';
          this.billCode = '|TP';
        }
        else if (this.addType == 'freetext'){
          this.orderData.code = '|TL';
          this.billCode = '|TL';
        }
          
        if(this.orderData.code == '|CP' || this.orderData.code == '|TC' || this.orderData.code == '|TP' || this.orderData.code == '|TL'){
          this.showEditField = false;
        }
        else{
          this.showEditField = true;
        }
    }
    else if(args.requestType === 'save') {
      args.data['progressive'] = +this.billProgressive;
      args.data['description'] = this.billDescription.replace(/<\/?[^>]+(>|$)/g, "");
      args.data['code'] = this.billCode;
      if(this.billCode == '|CP' || this.billCode == '|TC' || this.billCode == '|TP' || this.billCode == '|TL') {
        args.data['qty'] = 0;
        args.data['price'] = 0;
        args.data['total'] = 0;  
      }
      else {
        args.data['qty'] = this.billQty;
        args.data['price'] = this.billPrice;
        args.data['total'] = this.billQty * this.billPrice;
      }
      if(this.umCtrl.value?.unitSize)
        args.data['measureUnit'] = this.umCtrl.value.unitSize;
      else
        args.data['measureUnit'] = this.umCtrl.value;
      
      let row = args.data as BillOfMaterialsDTO;
      
      this.refreshGrid();
    }
    else if(args.requestType === 'delete') {
      let rowSelected = args.data[0] as BillOfMaterialsDTO;
      this.refreshGrid();
    }
  }
  async rowDrop(e){
    let changedElement = e.data[0] as BillOfMaterialsDTO;
    if(e.fromIndex != e.dropIndex)
      changedElement.progressive = e.dropIndex + 1;
    this.refreshGrid();
  }
  async measuresRowDrop(e){
    let changedElement = e.data[0] as BillOfMaterialsCostAnalysisMeauseresDTO;
    if(e.fromIndex != e.dropIndex)
      changedElement.position = e.dropIndex + 1;
    
    this.refreshGrid();
    
  }
  rowDataBound(args: RowDataBoundEventArgs) {
    let row = args.data as BillOfMaterialsDTO;
    const BillOfMaterialsId = 'billOfMaterialsId';
    const filter: string = args.data[BillOfMaterialsId];
    const childrecord: any = new DataManager(this.grid.childGrid.dataSource as JSON[]).
    executeLocal(new Query().where('billOfMaterialsId', 'equal', parseInt(filter, 10), true));
    if (row.code === '|CP' || row.code === '|TC' || row.code === '|TP' || row.code === '|TL') {
        args.row.querySelector('td').innerHTML = ' ';
        args.row.querySelector('td').className = 'e-customizedExpandcell';        
    }
  }
  
  customiseCell(args: QueryCellInfoEventArgs) {
   
    if( (args.data['code'] == '|CP' || args.data['code'] == '|TC' || args.data['code'] == '|TP') && args.column.field === 'description') {
      args.cell.classList.add('chapter-style');
    }
    
    if(args.column.field != 'description' && args.column.field != undefined && (args.data['code'] == '|CP' || args.data['code'] == '|TL' )  ) {
      args.cell.innerHTML = '';            
    }
    
    if(args.column.field != undefined && args.column.field != 'description' && args.column.field != 'total' && (args.data['code'] == '|TC' || args.data['code'] == '|TP') ) {
      args.cell.innerHTML = '';            
    }
    
    if(args.column.field != undefined && args.column.field == 'total' && (args.data['code'] == '|TC' || args.data['code'] == '|TP') ) {
      args.cell.classList.add('bold-class');
    }
  }
  
  onQtyPriceChange(event){
    this.billTotal = this.billQty*this.billPrice;    
  }
  
  onMeasureDetailChange(){
    this.measureTotalMeasure = 0;
    if(this.measureQty != null && +this.measureQty != 0) {
      if(this.measureTotalMeasure == 0) {
        this.measureTotalMeasure = this.measureQty;
      } 
      else {
        this.measureTotalMeasure *= this.measureQty;
      }
    }
    if(this.measureWidth != null && +this.measureWidth != 0) {
      if(this.measureTotalMeasure == 0) {
        this.measureTotalMeasure = this.measureWidth;
      } 
      else {
        this.measureTotalMeasure *= this.measureWidth;
      }
    }         
    if(this.measureLength != null && +this.measureLength != 0){
      if(this.measureTotalMeasure == 0) {
        this.measureTotalMeasure = this.measureLength;
      } 
      else {
        this.measureTotalMeasure *= this.measureLength;
      }
    }
    if(this.measureHeight != null && +this.measureHeight != 0) {
      if(this.measureTotalMeasure == 0) {
        this.measureTotalMeasure = this.measureHeight;
      } 
      else {
        this.measureTotalMeasure *= this.measureHeight;
      }
    }       
  }
  
  async measureActionBegin(args: SaveEventArgs){
    if (args.requestType === 'beginEdit') {
      this.measureQty = args.rowData['qty']; 
      this.measureDesc = args.rowData['description']; 
      this.measureWidth = args.rowData['width']; 
      this.measureLength = args.rowData['length']; 
      this.measureHeight = args.rowData['height']; 
      this.measureTotalMeasure = args.rowData['totalMeasure']; 
      this.measureFormula = args.rowData['formula'];
    }
    else if (args.requestType === 'add'){
      (args.data as BillOfMaterialsCostAnalysisMeauseresDTO)['billOfMaterialsId'] = +localStorage.getItem('parentId');
    }
    else if(args.requestType === 'save'){
      let row = args.data as BillOfMaterialsCostAnalysisMeauseresDTO;
      row.qty = this.measureQty; 
      row.description = this.measureDesc;
      row.width = this.measureWidth;
      row.length = this.measureLength;
      row.height = this.measureHeight;
      row.totalMeasure = this.measureTotalMeasure;
      row.formula = this.measureFormula;
      
    }
    else if(args.requestType === 'delete'){
      let row = args.data[0] as BillOfMaterialsCostAnalysisMeauseresDTO;
      
      this.refreshGrid();
      
    }
  }
  onCheckFormulaChange(event){
    if(event.checked != true) 
      this.onMeasureDetailChange();
    else
      this.onFormulaChange();
  }
  onFormulaChange(){
    this.measureTotalMeasure = 0;
    this.measureTotalMeasure = math.evaluate(this.measureFormula);
  }
  clickHandler(args: ClickEventArgs): void {    
    const target: HTMLElement = (args.originalEvent.target as HTMLElement).closest('button');
    if (target.id === 'expandall') {
      if(this.isExpanded == false) {
        this.grid.detailRowModule.expandAll();
        this.isExpanded = true;        
      }
      else {
        this.grid.detailRowModule.collapseAll();
        this.isExpanded = false;        
      }      
    }              
  }
  onNewRecorsSelect(args: MenuEventArgs){
    if(args.item.id === 'newrecord') {
      this.addType = 'newrecord';
      this.grid.addRecord();
    }
    else if(args.item.id === 'chapter') {
      this.addType = 'chapter';
      this.grid.addRecord();
    }
    else if(args.item.id === 'totalchapter'){
      this.addType = 'totalchapter';
      this.grid.addRecord();
    }
    else if(args.item.id === 'partialtotal'){
      this.addType = 'partialtotal';
      this.grid.addRecord();
    }
    else if(args.item.id === 'freetext'){
      this.addType = 'freetext';
      this.grid.addRecord();
    }
  }
  getData(){
    let firstBill = new BillOfMaterialsDTO;
    let secondBill = new BillOfMaterialsDTO;
    let bill3 = new BillOfMaterialsDTO;
    let bill4 = new BillOfMaterialsDTO;
    let bill5 = new BillOfMaterialsDTO;
    let bill6 = new BillOfMaterialsDTO;

    firstBill.billOfMaterialsId = 1;
    firstBill.constructionSiteId = 7;
    firstBill.progressive = 1;
    firstBill.code = "01.01";
    firstBill.description = "description of bill";
    firstBill.measureUnit = "m2";
    firstBill.price = 5;
    firstBill.qty = 2;
    firstBill.total = 10;


    this.dataBill.push(firstBill);

    secondBill.billOfMaterialsId = 2;
    secondBill.constructionSiteId = 7;
    secondBill.progressive = 2;
    secondBill.code = "01.02";
    secondBill.description = "description of bill 2";
    secondBill.measureUnit = "m2";
    secondBill.price = 3;
    secondBill.qty = 3;
    secondBill.total = 9;

    this.dataBill.push(secondBill);

    bill3.billOfMaterialsId = 3;
    bill3.constructionSiteId = 7;
    bill3.progressive = 3;
    bill3.code = "01.03";
    bill3.description = "description of bill 3";
    bill3.measureUnit = "m2";
    bill3.price = 3;
    bill3.qty = 3;
    bill3.total = 9;

    this.dataBill.push(bill3);

    bill4.billOfMaterialsId = 4;
    bill4.constructionSiteId = 7;
    bill4.progressive = 4;
    bill4.code = "01.04";
    bill4.description = "description of bill 4";
    bill4.measureUnit = "m2";
    bill4.price = 3;
    bill4.qty = 3;
    bill4.total = 9;

    this.dataBill.push(bill4);

    bill5.billOfMaterialsId = 5;
    bill5.constructionSiteId = 7;
    bill5.progressive = 2;
    bill5.code = "01.05";
    bill5.description = "description of bill 5";
    bill5.measureUnit = "m2";
    bill5.price = 3;
    bill5.qty = 3;
    bill5.total = 9;

    this.dataBill.push(bill5);

    bill6.billOfMaterialsId = 6;
    bill6.constructionSiteId = 7;
    bill6.progressive = 6;
    bill6.code = "01.06";
    bill6.description = "description of bill 6";
    bill6.measureUnit = "m2";
    bill6.price = 3;
    bill6.qty = 3;
    bill6.total = 9;

    this.dataBill.push(bill6);

    let firstMeasures = new BillOfMaterialsCostAnalysisMeauseresDTO;
    let secondMeasures = new BillOfMaterialsCostAnalysisMeauseresDTO;

    firstMeasures.billOfMaterialsCostAnalysisMeasuresId = 1;
    firstMeasures.billOfMaterialsId = 1;
    firstMeasures.constructionSiteId = 7;
    firstMeasures.position = 1;
    firstMeasures.description = "measure 1";
    firstMeasures.qty = 4;
    firstMeasures.width = 2;
    firstMeasures.totalMeasure = 8;

    this.dataMeasures.push(firstMeasures);

    secondMeasures.billOfMaterialsCostAnalysisMeasuresId = 2;
    secondMeasures.billOfMaterialsId = 1;
    secondMeasures.constructionSiteId = 7;
    secondMeasures.position = 2;
    secondMeasures.description = "measure 2";
    secondMeasures.qty = 2;
    secondMeasures.width = 2;
    secondMeasures.totalMeasure = 4;

    this.dataMeasures.push(secondMeasures);

    this.myData.billOfMaterialList = this.dataBill;
    this.myData.billOfMaterialsCostAnalysisMeauseresList = this.dataMeasures;
  }
  onPuntiFieldChange(event){
    if(this.billFattValPunti != null && this.billFattValPunti != 0){
      this.billPrice = this.billPunti * this.billFattValPunti;
    }
  }
  onCPUFieldChange(event){
    
    this.cpuCalculate();

  }
  cpuCalculate():number{
    let discountV = 0;
    if(this.billDiscount != null && this.billDiscount != 0)
      discountV = this.billPrice * this.billDiscount / 100;

    this.billNetPrice = this.billPrice - discountV;

    let labV = 0;
    if(this.billIncLabor != null && this.billIncLabor != 0){
      labV = this.billNetPrice * this.billIncLabor / 100;
    }
    
    let chargesV = 0;
    if(this.billIncCharges != null && this.billIncCharges != 0) {
        chargesV = this.billNetPrice * this.billIncCharges / 100;
    }
    this.billNetPrice = this.billNetPrice - labV - chargesV;
    return this.billNetPrice;
  }
  dataBound(event) {
    if (this.expandFlag && this.indexes.length !== 0) { 
      // Condition executes on global flag enabled case 
      // The global flag is disabled so that this case is not executed on consecutive event triggers 
      this.expandFlag = false; 
      // Each stored parent row index is expanded 
      this.indexes.forEach(ind => this.grid.detailRowModule.expand(ind)); 
      this.indexes = []; 
    } 
    //this.grid.autoFitColumns(['progressive', 'measureUnit', 'qty', 'price','total']);
  }
  public itemBeforeEvent (args: MenuEventArgs) {    
  }
  actionComplete(e) {
    if (e.requestType === "beginEdit") {
      setTimeout(()=>{
         e.form.elements[this.fieldName].focus();
      })
    }
    if (e.requestType == "add" ) {
      setTimeout(()=>{
         e.form.elements["progressive"].focus();
      })
    }
  }
  recordDoubleClick(e) {
    var clickedColumnIndex = +e.cell.getAttribute("data-colindex");
    this.fieldName = this.grid.getColumnByIndex(clickedColumnIndex).field;
  }
}
