import { ActionPriceHistory } from "../action/actionPriceHistory";
import { TradeWallet } from "./tradeWallet";
import { BuyAndSale } from "./buyAndSale";
import { TradeOperation } from "./tradeOperation";

/**
 * Cas de trading sur une année
 *  
 * googleHistory: historique du cours des actions google
 * amazoneHistory: historique du cours des actions amazon
 * buyAndSaleCount: nombre d'achat et de vente dans l'année
 * tradeOperationList: historique des opérations de trading
 * 
 */
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

    /**
     * Calcule le gain effectué pour le cas donné
     * 
     * Le calcul est déternminé par le nombre d'achat et de vente effectués dans l'année (buyAndSaleCount)
     * 
     * @param amount montant inital
     * @return gain calculé
     * 
     */
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

    /**
     * Calcule l'opération d'achat et de vente sur une période donnée
     * 
     * L'opération d'achat de vente retenue est la meilleure entre google et amazon
     * 
     * @param beginIndex: index de la 1ère actionPrice étudiée dans l'historique des cours google et amazon
     * @param endIndex: index de la dernière + 1 actionPrice étudiée dans l'historique des cours google et amazon
     * @return nouvelle instance du portefeuille
     * 
     */
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