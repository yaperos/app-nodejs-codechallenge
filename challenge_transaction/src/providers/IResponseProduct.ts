export interface IResponseProduct{
    succes:boolean,
    message:string,
    result:IResult
}

export interface IResult {
    count:number,
    items:Array<IItems>
}

export interface IItems{
    external_id?:string,
    product_id?:string,
    sku?:string,
    image?:any,
    name?:string,
    short_description?:string,
    long_description?:string,
    price?:string
    variants?:Array<IVariants>
    options?:Array<option>
}

export interface IVariants{
    inventoryQuantity?: number,
    legacyResourceId: string,
    displayName: string,
    price?: string,
    selectedOptions?: Array<option>,
    inventory_quantity?:number,
    sku?:string
}

export interface ISelectionOptions{
    name: string,
    values:Array<any>
}

export interface option{
    id?:number,
    product_id?:number,
    name?:string,
    values?:Array<string>
}