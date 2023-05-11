import { TradeOperation } from "../trading/tradeOperation";
import { ActionName } from "./actionPriceHistory";

export type ActionOperation  = null | "buy" | "sale";

export class ActionPrice  {
    public name:ActionName;
    public timestamp:number;
    public highestPrice:number;
    public lowestPrice:number;
    public operation:ActionOperation;

    constructor(name:ActionName, timestamp:number, highestPrice:number, 
        lowestPrice:number, operation:ActionOperation) { 
        this.name = name;
        this.timestamp = timestamp;
        this.highestPrice = highestPrice;
        this.lowestPrice = lowestPrice;
        this.operation = operation;
    }

     public getAmount(count: number): number {
        if( "sale" == this.operation) {
           return this.highestPrice * count;
        } else if( "buy" == this.operation) {
            return this.lowestPrice * count;
        } else {
            return 0;
        }
    }

    public getGain(actionPrice:ActionPrice): number {
        //console.log("gain: highestPrice: " + actionPrice.highestPrice + "; lowestPrice:" + this.lowestPrice)
        return actionPrice.highestPrice / this.lowestPrice;
    }

    public static createFromJSON(name:ActionName, data: any): ActionPrice {
        return new ActionPrice(name, data.timestamp as number
            , data.highestPriceOfTheDay as number
            , data.lowestPriceOfTheDay as number, null)
    }

    public toStrirng():string {
        return "actionSale: {timpestamp: " + this.timestamp + "; highestPrice:" + this.highestPrice + "; lowestPrice:" + this.lowestPrice + "}"
    }

}