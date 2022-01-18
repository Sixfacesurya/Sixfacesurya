export interface IProduct{
    id:number;
    Title:string;
    Description:string;
}
export class Product {
    id:number;
    Title:string;
    Description:string;
    constructor(Title?:string,Description?:string){
        this.Title = Title;
        this.Description = Description;
    }
}
