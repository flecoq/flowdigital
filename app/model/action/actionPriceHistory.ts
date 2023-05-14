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
            data.forEach( item => {
                let actionPrice = ActionPrice.createFromJSON(this.name, item);
                this.addActionPrice(actionPrice);
            });
        }
    }
}