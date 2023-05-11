import { ActionPrice } from "app/model/action/actionPrice";
import { TradeOperation } from "app/model/trading/tradeOperation";
import { TradeWallet } from "app/model/trading/tradeWallet";

export class Operation {
    public date:string;
    public action:string;
    public name:string;
    public price:number;
    public count:number;
    public total:number;
    public walletAmount:number;

    /*constructor(date:string, action:string, name:string, public price:string, count:number, total:number, walletAmount:number) {
        this.date = date;
        this.action = action;
        this.name = name;
        this.price = price;
        this.count = count;;
        this.total = total;
        this.walletAmount = walletAmount;
    }*/

    constructor(tradeOperation: TradeOperation) {
        let actionPrice:ActionPrice = tradeOperation.actionPrice;
        this.date = new Date(actionPrice.timestamp).toDateString();
        this.action = actionPrice.operation == "buy" ? "ACHAT" : "VENTE";
        this.name = actionPrice.name == "g" ? "GOOGLE" : "AMAZONE";
        this.price = actionPrice.operation == "buy" ? actionPrice.lowestPrice : actionPrice.highestPrice;
        this.count = tradeOperation.actionCount;
        this.total = this.price * this.count;
        this.walletAmount = (tradeOperation.tradeWallet as TradeWallet).amount;
    }
}