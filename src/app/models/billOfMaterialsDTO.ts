export class BillOfMaterialsDTO {
    billOfMaterialsId: number; 
    constructionSiteId: number;
    progressive: number;
    clientId: number;
    code: string;
    description: string;
    measureUnit: string;
    price: number;
    qty: number;
    total: number;
    discount: number;
    points: number;
    fvp: number;
    decrease: number;
    incLabor: number;
    incCharges: number;
    currencyId: string;
}