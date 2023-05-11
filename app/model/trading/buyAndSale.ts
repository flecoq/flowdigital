import { TradeOperation } from "./tradeOperation";
import { TradeWallet } from "./tradeWallet";
import { ActionPrice } from "../action/actionPrice";
import { ActionPriceHistory } from "../action/actionPriceHistory";

export class BuyAndSale {
    public beginIndex:number;
    public endIndex:number;
    public actionPriceHistory:ActionPriceHistory;
    public buyOperation:TradeOperation | null;
    public saleOperation:TradeOperation | null;

    public buyIndex:number;
    public saleIndex:number;
    public gain:number;

    constructor(beginIndex:number, endIndex:number, actionPriceHistory:ActionPriceHistory) {
        this.beginIndex = beginIndex;
        this.endIndex = endIndex;
        this.actionPriceHistory = actionPriceHistory;
        this.buyOperation = null;
        this.saleOperation = null;
        this.buyIndex = -1;
        this.saleIndex = -1;
        this.gain = 1;
    }

    public calculateOperationSimplest(): void {

        let buyValue:number = this.actionPriceHistory.actionPriceList[this.beginIndex].lowestPrice;
        let buyIndex:number = this.beginIndex;
        let saleValue:number = 0;
        let saleIndex:number = 0;

        for(let u = this.beginIndex; u < this.endIndex; u++) {
            let actionPrice:ActionPrice =  this.actionPriceHistory.actionPriceList[u];
            if( actionPrice.lowestPrice < buyValue) {
                buyValue = actionPrice.lowestPrice;
                buyIndex = u;
            }
            if( actionPrice.highestPrice > saleValue) {
                saleValue = actionPrice.highestPrice;
                saleIndex = u;
            }
        }

       if( saleIndex > buyIndex) {
            this.buyIndex = buyIndex;
            this.saleIndex = saleIndex;
            this.gain = this.actionPriceHistory.actionPriceList[buyIndex].getGain(this.actionPriceHistory.actionPriceList[saleIndex]);
        }
    }

    public calculateOperationLoop(): void {
        for(let u = this.beginIndex; u < this.endIndex; u++) {
            let buyActionPrice:ActionPrice =  this.actionPriceHistory.actionPriceList[u];
            for(let v = u+1; v < this.endIndex; v++) {
                let saleActionPrice:ActionPrice =  this.actionPriceHistory.actionPriceList[v];
                let currentGain:number = buyActionPrice.getGain(saleActionPrice);
                //console.log("u:" + u + "; v:" + v +"; gain:" + currentGain);
                if( currentGain > this.gain ) {
                    this.gain = currentGain;
                    this.buyIndex = u;
                    this.saleIndex = v;
                }
            }
        }
    }

    public calculateOperation(): void {
        this.calculateOperationSimplest();
        if( this.buyIndex < 0) {
            console.log("buyAndSale.calculateOperationLoop() required");
            this.calculateOperationLoop();
        }
    }

    public setOperation():void {
        if( this.buyIndex >= 0) {
            let buyActionPrice:ActionPrice = this.actionPriceHistory.actionPriceList[this.buyIndex];
            buyActionPrice.operation= "buy";
            this.buyOperation = new TradeOperation(buyActionPrice);
        }
 
        if( this.saleIndex >= 0) {
            let saleActionPrice:ActionPrice = this.actionPriceHistory.actionPriceList[this.saleIndex];
            saleActionPrice.operation = "sale";
            this.saleOperation = new TradeOperation(saleActionPrice);
        }
    }

    public updateWallet(tradeWallet:TradeWallet, buyPercent:number): TradeWallet {
        this.setOperation();
        let result:TradeWallet = this.buyOperation ? this.buyOperation?.setWallet(tradeWallet, buyPercent) : tradeWallet;   
        result = this.saleOperation ? this.saleOperation?.setWallet(result as TradeWallet, 0) : result;
        return result;
    }

    public toString():string {
        return "buyAndSale: {beginIndex: " + this.beginIndex + "; endIndex:" + this.endIndex + "; buyIndex: " + this.buyIndex + "; saleIndex:" + this.saleIndex + "}";
    }

}