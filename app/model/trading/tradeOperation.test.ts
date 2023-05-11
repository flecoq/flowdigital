import { ActionPrice } from "../action/actionPrice";
import { TradeWallet } from "./tradeWallet";
import { TradeOperation } from "./tradeOperation";

describe("tradeOperation Test", () => {
    it("should buy google action", async () => {
        const actionPrice:ActionPrice = new ActionPrice("g", 0,100,50,"buy");
        const tradeOperation:TradeOperation = new TradeOperation(actionPrice);
        const tradeWallet:TradeWallet = tradeOperation.setWallet(new TradeWallet(1000, 0, 0), 1.0);
        //console.log(tradeWallet.toString());
        expect(tradeWallet.amount).toEqual(0);
        expect(tradeWallet.googleActionCount).toEqual(20);
        expect(tradeWallet.amazonActionCount).toEqual(0);
    });
    it("should sale gooogle action", async () => {
        const actionPrice:ActionPrice = new ActionPrice("g", 0,100,50,"sale");
        const tradeOperation:TradeOperation = new TradeOperation(actionPrice);
        const tradeWallet:TradeWallet = tradeOperation.setWallet(new TradeWallet(1000, 5, 0), 1.0);
        //console.log(tradeWallet.toString());
        expect(tradeWallet.amount).toEqual(1500);
        expect(tradeWallet.googleActionCount).toEqual(0);
        expect(tradeWallet.amazonActionCount).toEqual(0);
    });
    it("should buy amazone action", async () => {
        const actionPrice:ActionPrice = new ActionPrice("a", 0,100,50,"buy");
        const tradeOperation:TradeOperation = new TradeOperation(actionPrice);
        const tradeWallet:TradeWallet = tradeOperation.setWallet(new TradeWallet(1000, 0, 0), 1.0);
        //console.log(tradeWallet.toString());
        expect(tradeWallet.amount).toEqual(0);
        expect(tradeWallet.googleActionCount).toEqual(0);
        expect(tradeWallet.amazonActionCount).toEqual(20);
    });
    it("should sale amazone action", async () => {
        const actionPrice:ActionPrice = new ActionPrice("a", 0,100,50,"sale");
        const tradeOperation:TradeOperation = new TradeOperation(actionPrice);
        const tradeWallet:TradeWallet = tradeOperation.setWallet(new TradeWallet(1000, 0, 5), 1.0);
        //console.log(tradeWallet.toString());
        expect(tradeWallet.amount).toEqual(1500);
        expect(tradeWallet.googleActionCount).toEqual(0);
        expect(tradeWallet.amazonActionCount).toEqual(0);
    });

 });