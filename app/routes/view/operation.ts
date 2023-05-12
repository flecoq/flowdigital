import { ActionPrice } from "app/model/action/actionPrice";
import { TradeOperation } from "app/model/trading/tradeOperation";
import { TradeWallet } from "app/model/trading/tradeWallet";

/**
 * Stocke les données d'une opération de trading pour l'affichage
 * 
 */
export class Operation {
    public date:string;
    public action:string;
    public name:string;
    public price:number;
    public count:number;
    public total:string;
    public walletAmount:string;

    constructor(tradeOperation: TradeOperation) {
        let actionPrice:ActionPrice = tradeOperation.actionPrice;
        this.date = new Date(actionPrice.timestamp).toLocaleDateString('en-GB');
        this.action = actionPrice.operation == "buy" ? "ACHAT" : "VENTE";
        this.name = actionPrice.name == "g" ? "GOOGLE" : "AMAZONE";
        this.price = actionPrice.operation == "buy" ? actionPrice.lowestPrice : actionPrice.highestPrice;
        this.count = tradeOperation.actionCount;
        this.total = (this.price * this.count).toFixed(2);
        this.walletAmount = (tradeOperation.tradeWallet as TradeWallet).amount.toFixed(2);
    }
}