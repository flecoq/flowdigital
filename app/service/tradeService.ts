import { getData } from "app/data/data";
import { ActionPriceHistory } from "app/model/action/actionPriceHistory";
import { BuyAndSale } from "app/model/trading/buyAndSale";
import { TradeWallet } from "app/model/trading/tradeWallet";
import { TradeCase } from "app/model/trading/tradeCase";
import { ActionPrice } from "app/model/action/actionPrice";

/**
 * Service dédié au traitement des FEAT 2 et 3
 *  
 * googleHistory: historique du cours des actions google
 * amazonHistory: historique du cours des actions amazon
 * 
 */
export class TradeService {
    public googleHistory:ActionPriceHistory;
    public amazoneHistory:ActionPriceHistory;

    // feat 1
    public googleGraphData:number[] = [];
    public amazonGraphData:number[] = [];

    // feat 2
    public buyAndSaleAymen:BuyAndSale | null = null;
    public walletAymen:TradeWallet;
    public buyAndSaleAnouar:BuyAndSale | null = null;
    public walletAnouar:TradeWallet;

    // feat 3
    public tradeCase:TradeCase | null = null;
    public gain:number = 0;
    public timer:number = 0;

    constructor() {
        this.googleHistory =  new ActionPriceHistory('g');
        this.amazoneHistory =  new ActionPriceHistory('a');

        const amount:number = 100000;
        this.walletAymen = new TradeWallet(amount, 0, 0);
        this.walletAnouar = new TradeWallet(amount, 0, 0);
    }

    /**
     * Charge les historiques google et amazon
     */
    public async load() {
        const googleData = await getData('resources/GOOG-stock-price.json')
        this.googleHistory.createFromJSON(googleData);       
        const amazoneData = await getData('resources/AMZN-stock-price.json')
        this.amazoneHistory.createFromJSON(amazoneData);       
    }

    /**
     * Traite la FEAT 1
     */
    public calculateFeat1(): void {
        this.amazonGraphData = this.getGraphData(this.amazoneHistory);
        this.googleGraphData = this.getGraphData(this.googleHistory);
    }

    /**
     * Traite la FEAT 2
     */
    public calculateFeat2(): void {
        // Aymen
        this.buyAndSaleAymen = new BuyAndSale(0, this.amazoneHistory.getActionPriceCount(), this.amazoneHistory);
        this.buyAndSaleAymen.calculateOperation();
        this.walletAymen = this.buyAndSaleAymen.updateWallet(this.walletAymen, 1.0);
    
        // Anouar
        this.buyAndSaleAnouar = new BuyAndSale(0, this.googleHistory.getActionPriceCount(), this.googleHistory);
        this.buyAndSaleAnouar.calculateOperation();
        this.walletAnouar = this.buyAndSaleAnouar.updateWallet(this.walletAnouar, 1.0);
    }

     /**
     * Traite la FEAT 3
     */
     public calculateFeat3(division:number): void {
        const start:number = (new Date()).getMilliseconds();
        const amount:number = 100000;
        this.tradeCase = new TradeCase(this.googleHistory, this.amazoneHistory, division, 1.0);
        this.gain = this.tradeCase.calculateGain(amount);
        this.timer = (new Date()).getMilliseconds() - start;
    }

    public getGraphData(history:ActionPriceHistory): number[] {
        let result:number[] = [];
        let month:number = 0;
        let count:number = 0;
        let value:number = 0;
        for(let u = 0; u < history.actionPriceList.length; u++) {
            const actionPrice:ActionPrice = history.actionPriceList[u];
            const actionMonth:number = (new Date(actionPrice.timestamp)).getMonth();
            if( actionMonth > month || u == history.actionPriceList.length - 1) {
                const average:number = value / count;
                result.push(average);
                month++;
                count = 0;
                value = 0;
            } else {
                count++;
                value += (actionPrice.lowestPrice + actionPrice.highestPrice)/2;
            }
        }
        return result;
    }

}