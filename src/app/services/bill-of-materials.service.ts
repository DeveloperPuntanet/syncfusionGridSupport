import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../environments/environment';
import { BillOfMaterialsDTO } from '../models/billOfMaterialsDTO';
import { BillMaterialsMeasuresDTO } from '../models/BillMaterialsMeasuresDTO';
import { BillOfMaterialsCostAnalysisMeauseresDTO } from '../models/billOfMaterialsCostAnalysisMeauseresDTO';

@Injectable({
  providedIn: 'root'
})
export class BillOfMaterialsService {
  private url = URL.apiUrl;

  constructor(private http: HttpClient) { }

  getBillOfMaterial(id:number){
    return this.http.get<BillMaterialsMeasuresDTO>(this.url + 'bmdailyregteamsrep/get/BillOfMaterials/' + id);
  }
  postBillOfMaterial(bill:BillOfMaterialsDTO){
    return this.http.post<any>(this.url + 'bmdailyregteamsrep/post/BillOfMaterials',bill);
  }
  putBillOfMaterial(bill:BillOfMaterialsDTO,id:number){
    return this.http.put<any>(this.url + 'bmdailyregteamsrep/put/BillOfMaterials/'+id,bill);
  }
  deleteBillOfMaterial(id:number){
    return this.http.delete<any>(this.url + 'bmdailyregteamsrep/delete/BillOfMaterials/'+id);
  }
  postBillOfMaterialMeasures(measures:BillOfMaterialsCostAnalysisMeauseresDTO, constructionSiteId: number, billId: number){
    return this.http.post<any>(this.url + 'bmdailyregteamsrep/post/BillOfMaterialsCostAnalysisMeasures/measures/'+ constructionSiteId + '/' + billId, measures);
  }
  putBillOfMaterialMeasures(measures:BillOfMaterialsCostAnalysisMeauseresDTO,id:number){
    return this.http.put<any>(this.url + 'bmdailyregteamsrep/put/BillOfMaterialsCostAnalysisMeasures/'+id,measures);
  }
  deleteBillOfMaterialMeasures(id:number){
    return this.http.delete<any>(this.url + 'bmdailyregteamsrep/delete/BillOfMaterialsCostAnalysisMeasures/'+id);
  }
  
}
