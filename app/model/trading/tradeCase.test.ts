import { ActionPrice } from "../action/actionPrice";
import { ActionPriceHistory } from "../action/actionPriceHistory";
import { TradeWallet } from "./tradeWallet";
import { TradeCase } from "./tradeCase";

describe("tradeCase Test", () => {
    it("should buyAndSale gain", async () => {
        const googleHistory:ActionPriceHistory = new ActionPriceHistory("g");
        googleHistory.addActionPrice(new ActionPrice("g", 0,100,50,null));
        googleHistory.addActionPrice(new ActionPrice("g", 1,200,100,null));

        const amazoneHistory:ActionPriceHistory = new ActionPriceHistory("a");
        amazoneHistory.addActionPrice(new ActionPrice("a", 0,100,80,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 1,160,60,null));

        let tradeCase = new TradeCase(googleHistory, amazoneHistory, 2, 1.0);
        const wallet:TradeWallet = tradeCase.buyAndSale(new TradeWallet(1000, 0, 0), 0, 2);
        expect(wallet.amount).toEqual(4000);
    });
    it("should calculateGain gain 1", async () => {
        const googleHistory:ActionPriceHistory = new ActionPriceHistory("g");
        googleHistory.addActionPrice(new ActionPrice("g", 0,100,50,null));
        googleHistory.addActionPrice(new ActionPrice("g", 1,200,100,null));
        googleHistory.addActionPrice(new ActionPrice("g", 2,100,80,null));
        googleHistory.addActionPrice(new ActionPrice("g", 3,160,60,null));

        const amazoneHistory:ActionPriceHistory = new ActionPriceHistory("a");
        amazoneHistory.addActionPrice(new ActionPrice("a", 0,100,80,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 1,160,60,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 2,100,50,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 3,200,100,null));

        let tradeCase = new TradeCase(googleHistory, amazoneHistory, 2, 1.0);
        const gain:number = tradeCase.calculateGain(1000);
        expect(gain).toEqual(16);
    });
    it("should calculateGain gain 2", async () => {
        const googleHistory:ActionPriceHistory = new ActionPriceHistory("g");
        googleHistory.addActionPrice(new ActionPrice("g", 0,100,50,null));
        googleHistory.addActionPrice(new ActionPrice("g", 1,200,100,null));
        googleHistory.addActionPrice(new ActionPrice("g", 2,100,80,null));
        googleHistory.addActionPrice(new ActionPrice("g", 3,100,80,null));
        googleHistory.addActionPrice(new ActionPrice("g", 4,160,60,null));

        const amazoneHistory:ActionPriceHistory = new ActionPriceHistory("a");
        amazoneHistory.addActionPrice(new ActionPrice("a", 0,100,80,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 1,160,60,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 2,100,50,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 3,100,50,null));
        amazoneHistory.addActionPrice(new ActionPrice("a", 4,200,100,null));

        let tradeCase = new TradeCase(googleHistory, amazoneHistory, 2, 1.0);
        const gain:number = tradeCase.calculateGain(1000);
        expect(gain).toEqual(16);
    });
});
