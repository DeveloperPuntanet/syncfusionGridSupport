import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../environments/environment';
import { TabUnitMeasureDTO } from '../models/tabUnitMeasureDTO';



@Injectable({
  providedIn: 'root'
})
export class TabBuildMasterService {

  private url = URL.apiUrl;

  constructor(private http: HttpClient) { }

  getUnitMeasures(languageId:number=103){
    return this.http.get<TabUnitMeasureDTO[]>(this.url + 'bmtabmanagement/get/measureunits/'+languageId);
  }
  getUnitMeasuresById(id:number,languageId:number=103){
    return this.http.get<TabUnitMeasureDTO>(this.url + 'bmtabmanagement/get/measureunits/'+id+'/'+languageId);
  }
  postUnitMeasures(um:TabUnitMeasureDTO){
    return this.http.post<number>(this.url + 'bmtabmanagement/post/measureunits',um);
  }
  putUnitMeasures(id:number,um:TabUnitMeasureDTO){
    return this.http.put<any>(this.url + 'bmtabmanagement/put/measureunits/'+id,um);
  }
  deleteUnitMeasures(id:number){
    return this.http.delete<any>(this.url + 'bmtabmanagement/delete/measureunits/'+id);
  }
}
