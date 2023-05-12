import { TradeOperation } from "../trading/tradeOperation";
import { ActionName } from "./actionPriceHistory";

export type ActionOperation  = null | "buy" | "sale";

/**
 * Stocke les données du cours d'une action pour une date donnée
 *  
 * name: nom de l'action ("g" | "a")
 * timestamp: timestamp du cour de l'action
 * highestPrice: valeur haute de l'action sur la journée
 * lowestPrice: valeur basse de l'action sur la journée
 * operation: operation de trading effectué sur cette action (null | "buy" | "sale")
 * 
 */
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

    /**
     * Calcule le montant pour une opération sur une action
     * 
     * @param count nombre d'actions
     * 
     */
    public getAmount(count: number): number {
        if( "sale" == this.operation) {
            return this.highestPrice * count;
            //return (this.highestPrice + this.lowestPrice ) * count / 2;
        } else if( "buy" == this.operation) {
            return this.lowestPrice * count;
            //return (this.highestPrice + this.lowestPrice ) * count / 2;
        } else {
            return 0;
        }
    }

    /**
     * Calcule le gain d'une opération d'achat et de vente
     * 
     * @param actionPrice action vendue
     * 
     */    
    public getGain(actionPrice:ActionPrice): number {
        //console.log("gain: highestPrice: " + actionPrice.highestPrice + "; lowestPrice:" + this.lowestPrice)
        return actionPrice.highestPrice / this.lowestPrice;
    }

    /**
     * Crée une instance à partir des données du fichier JSON
     * 
     * @param name nom de l'action ("g" | "a")
     * @param data données du fichier JSON
     * @return l'instance crée
     * 
     */ 
    public static createFromJSON(name:ActionName, data: any): ActionPrice {
        return new ActionPrice(name, data.timestamp as number
            , data.highestPriceOfTheDay as number
            , data.lowestPriceOfTheDay as number, null)
    }

    public toStrirng():string {
        return "actionSale: {timpestamp: " + this.timestamp + "; highestPrice:" + this.highestPrice + "; lowestPrice:" + this.lowestPrice + "}"
    }

}