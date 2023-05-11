import { ActionPrice } from "../action/actionPrice";
import { TradeWallet } from "./tradeWallet";

export class TradeOperation {
    public actionPrice:ActionPrice;
    public actionCount:number;
    public tradeWallet:TradeWallet | null;

    constructor(actionPrice:ActionPrice) {
        this.actionPrice = actionPrice;
        this.actionCount = 0;
        this.tradeWallet = null;
    }

    public setWallet(tradeWallet:TradeWallet, buyPercent:number): TradeWallet {
        this.tradeWallet = tradeWallet.clone();
        if( "buy" == this.actionPrice.operation) {
            this.actionCount = Math.trunc(tradeWallet.amount * buyPercent / this.actionPrice.lowestPrice);
            this.tradeWallet.amount -= this.actionPrice.getAmount(this.actionCount);
            if( "g" == this.actionPrice.name) {
                this.tradeWallet.googleActionCount += this.actionCount;
            } else {
                this.tradeWallet.amazonActionCount += this.actionCount;
            }
        } else {
            if( "g" == this.actionPrice.name) {
                this.actionCount = this.tradeWallet.googleActionCount;
                this.tradeWallet.amount += this.actionPrice.getAmount(this.tradeWallet.googleActionCount);
               this.tradeWallet.googleActionCount = 0;
            } else {
                this.actionCount = this.tradeWallet.amazonActionCount;
                this.tradeWallet.amount += this.actionPrice.getAmount(this.tradeWallet.amazonActionCount);
                this.tradeWallet.amazonActionCount = 0;
            }
        }
        return this.tradeWallet;
    }

}