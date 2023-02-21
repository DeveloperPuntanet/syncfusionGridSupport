import { LocalizedDTO } from "./localizedDTO";


export class TabUnitMeasureDTO{
    measureUnitId:number;
    clientId:number;
    unitSize:string;
    position:number;
    localizedMeasureUnits:LocalizedDTO[];
}