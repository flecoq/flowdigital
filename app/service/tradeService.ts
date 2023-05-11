import { getData } from "app/data/data";
import { ActionPriceHistory } from "app/model/action/actionPriceHistory";
import { BuyAndSale } from "app/model/trading/buyAndSale";
import { TradeWallet } from "app/model/trading/tradeWallet";
import { TradeCase } from "app/model/trading/tradeCase";

export class TradeService {
    public googleHistory:ActionPriceHistory;
    public amazoneHistory:ActionPriceHistory;

    // feat 2
    public buyAndSaleAymen:BuyAndSale | null = null;
    public walletAymen:TradeWallet;
    public buyAndSaleAnouar:BuyAndSale | null = null;
    public walletAnouar:TradeWallet;

    // feat 3
    public tradeCase:TradeCase | null = null;
    public gain:number = 0;

    constructor() {
        this.googleHistory =  new ActionPriceHistory('g');
        this.amazoneHistory =  new ActionPriceHistory('a');

        const amount:number = 100000;
        this.walletAymen = new TradeWallet(amount, 0, 0);
        this.walletAnouar = new TradeWallet(amount, 0, 0);
    }

    public async load() {
        const googleData = await getData('resources/GOOG-stock-price.json')
        this.googleHistory.createFromJSON(googleData);       
        const amazoneData = await getData('resources/AMZN-stock-price.json')
        this.amazoneHistory.createFromJSON(amazoneData);       
    }

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

    public calculateFeat3(): void {
        const amount:number = 100000;
        this.tradeCase = new TradeCase(this.googleHistory, this.amazoneHistory, 120, 1.0);
        this.gain = this.tradeCase.calculateGain(amount);
    }

}