import { ActionPriceHistory } from "../action/actionPriceHistory";
import { TradeWallet } from "./tradeWallet";
import { BuyAndSale } from "./buyAndSale";
import { TradeOperation } from "./tradeOperation";

export class TradeCase {
    public googleHistory:ActionPriceHistory;
    public amazoneHistory:ActionPriceHistory;
    public buyAndSaleCount:number;
    public buyBalance:number;
    public tradeOperationList:TradeOperation[];

    private actionPriceTotalCount:number;

    constructor(googleHistory:ActionPriceHistory,amazoneHistory:ActionPriceHistory
            , buyAndSaleCount:number, buyBalance:number) {
        this.googleHistory = googleHistory;
        this.amazoneHistory = amazoneHistory;
        this.actionPriceTotalCount = googleHistory.actionPriceList.length;
        this.buyAndSaleCount = buyAndSaleCount;
        this.buyBalance = buyBalance;
        this.tradeOperationList = [];
    }

    private addTradeOperation(tradeOperation:TradeOperation): void {
        this.tradeOperationList.push(tradeOperation);
    }

    public calculateGain(amount: number): number {
        const actionPriceCount:number = Math.trunc(this.actionPriceTotalCount / this.buyAndSaleCount);
        let wallet:TradeWallet = new TradeWallet(amount, 0, 0);
        for(let u:number = 0; u < this.buyAndSaleCount; u++) {
            const beginIndex:number = u * actionPriceCount;
            const endIndex:number = u == this.buyAndSaleCount - 1 ? this.actionPriceTotalCount : (u + 1) * actionPriceCount;
            wallet = this.buyAndSale(wallet, beginIndex, endIndex);
            //console.log(wallet.toString());
        }
        return wallet.amount / amount;
    }

    public buyAndSale(wallet:TradeWallet, beginIndex:number, endIndex:number):TradeWallet {
        const amazoneBuyAndSale:BuyAndSale = new BuyAndSale(beginIndex, endIndex, this.amazoneHistory);
        amazoneBuyAndSale.calculateOperation();
        const googleBuyAndSale:BuyAndSale = new BuyAndSale(beginIndex, endIndex, this.googleHistory);
        googleBuyAndSale.calculateOperation();
        console.log("tradeCase.buyAndSale: beginIndex: " + beginIndex + "; endIndex: " + endIndex + "; amazone gain:" + amazoneBuyAndSale.gain + "; google gain:" + googleBuyAndSale.gain)
        if( amazoneBuyAndSale.gain > googleBuyAndSale.gain) {
            wallet = amazoneBuyAndSale.updateWallet(wallet, 1.0);
            this.addTradeOperation(amazoneBuyAndSale.buyOperation as TradeOperation);
            this.addTradeOperation(amazoneBuyAndSale.saleOperation as TradeOperation);
        } else {
            wallet = googleBuyAndSale.updateWallet(wallet, 1.0);
            this.addTradeOperation(googleBuyAndSale.buyOperation as TradeOperation);
            this.addTradeOperation(googleBuyAndSale.saleOperation as TradeOperation);
        }
        return wallet;
    }

}