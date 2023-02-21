export class BillOfMaterialsCostAnalysisMeauseresDTO{
    billOfMaterialsCostAnalysisMeasuresId: number;
    billOfMaterialsId: number; //id del computo
    constructionSiteId: number;
    position: number;
    clientId: number;
    type: number; // Type  => 0=Dimensioni; 1=Formula
    description: string;
    qty: number;
    width: number;
    length: number;
    height: number;
    formula: string;
    totalMeasure: number;
    bimEntityGuid: string;
}