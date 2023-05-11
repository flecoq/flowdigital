import { ActionPrice } from "./actionPrice";

export type ActionName  = "g" | "a";

export class ActionPriceHistory {
    public name:ActionName;
    public actionPriceList: ActionPrice[] = [];

    constructor(name:ActionName) {
        this.name = name;
    }

    public addActionPrice(actionPrice: ActionPrice): void {
        this.actionPriceList.push(actionPrice);
    }

    public getActionPriceCount():number {
        return this.actionPriceList.length;
    }

    public createFromJSON(data: any): void {
        if( data ) {
            for(let actionPriceData of data) {
                let actionPrice = ActionPrice.createFromJSON(this.name, actionPriceData);
                this.addActionPrice(actionPrice);
            }
        }
    }
}