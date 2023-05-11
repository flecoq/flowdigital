import { ActionPrice } from "../action/actionPrice";
import { ActionPriceHistory } from "../action/actionPriceHistory";
import { BuyAndSale } from "./buyAndSale";
import { TradeWallet } from "./tradeWallet";

describe("buyAndSale Test", () => {
    it("should simplest calculation with gain", async () => {
        let history:ActionPriceHistory = new ActionPriceHistory("g");
        history.addActionPrice(new ActionPrice("g", 0,55,40,null));
        history.addActionPrice(new ActionPrice("g", 1,45,50,null));
        history.addActionPrice(new ActionPrice("g", 2,45,30,null));
        history.addActionPrice(new ActionPrice("g", 3,65,60,null));
        history.addActionPrice(new ActionPrice("g", 4,55,50,null));
        let buyAndSale:BuyAndSale = new BuyAndSale(0, history.getActionPriceCount(), history);
        buyAndSale.calculateOperationSimplest();
        //console.log(buyAndSale.toStrirng());
        expect(buyAndSale.buyIndex).toEqual(2);
        expect(buyAndSale.saleIndex).toEqual(3);
    });

    it("should simplest operation calculation no gain 1", async () => {
        let history:ActionPriceHistory = new ActionPriceHistory("g");
        history.addActionPrice(new ActionPrice("g", 0,50,60,null));
        history.addActionPrice(new ActionPrice("g", 1,80,40,null));
        let buyAndSale:BuyAndSale = new BuyAndSale(0, history.getActionPriceCount(), history);
        buyAndSale.calculateOperationSimplest();
        //console.log(buyAndSale.toStrirng());
        expect(buyAndSale.buyIndex).toEqual(-1);
        expect(buyAndSale.saleIndex).toEqual(-1);
    });

    it("should simplest operation calculation no gain 2", async () => {
        let history:ActionPriceHistory = new ActionPriceHistory("g");
        history.addActionPrice(new ActionPrice("g", 0,55,40,null));
        history.addActionPrice(new ActionPrice("g", 1,45,50,null));
        history.addActionPrice(new ActionPrice("g", 2,45,30,null));
        history.addActionPrice(new ActionPrice("g", 3,65,60,null));
        history.addActionPrice(new ActionPrice("g", 4,55,50,null));
        history.addActionPrice(new ActionPrice("g", 5,55,10,null));
        let buyAndSale:BuyAndSale = new BuyAndSale(0, history.getActionPriceCount(), history);
        buyAndSale.calculateOperationSimplest();
        //console.log(buyAndSale.toStrirng());
        expect(buyAndSale.buyIndex).toEqual(-1);
        expect(buyAndSale.saleIndex).toEqual(-1);
    });

    it("should loop operation calculation gain", async () => {
        let history:ActionPriceHistory = new ActionPriceHistory("g");
        history.addActionPrice(new ActionPrice("g", 0,55,40,null));
        history.addActionPrice(new ActionPrice("g", 1,65,50,null));
        history.addActionPrice(new ActionPrice("g", 2,45,5,null));
        history.addActionPrice(new ActionPrice("g", 3,35,60,null));
        history.addActionPrice(new ActionPrice("g", 4,25,65,null));
        let buyAndSale:BuyAndSale = new BuyAndSale(0, history.getActionPriceCount(), history);
        buyAndSale.calculateOperationLoop();
        //console.log(buyAndSale.toString());
        expect(buyAndSale.buyIndex).toEqual(2);
        expect(buyAndSale.saleIndex).toEqual(3);
    });

    it("should operation calculation gain", async () => {
        let history:ActionPriceHistory = new ActionPriceHistory("g");
        history.addActionPrice(new ActionPrice("g", 0,55,40,null));
        history.addActionPrice(new ActionPrice("g", 1,65,50,null));
        history.addActionPrice(new ActionPrice("g", 2,45,5,null));
        history.addActionPrice(new ActionPrice("g", 3,35,60,null));
        history.addActionPrice(new ActionPrice("g", 4,25,65,null));
        let buyAndSale:BuyAndSale = new BuyAndSale(0, history.getActionPriceCount(), history);
        buyAndSale.calculateOperation();
        //console.log(buyAndSale.toString());
        expect(buyAndSale.buyIndex).toEqual(2);
        expect(buyAndSale.saleIndex).toEqual(3);
    });

    it("should update wallet with gain", async () => {
        let history:ActionPriceHistory = new ActionPriceHistory("g");
        history.addActionPrice(new ActionPrice("g", 0,55,100,null));
        history.addActionPrice(new ActionPrice("g", 4,200,50,null));
        let buyAndSale:BuyAndSale = new BuyAndSale(0, history.getActionPriceCount(), history);
        buyAndSale.buyIndex = 0;
        buyAndSale.saleIndex = 1;
        const tradeWallet:TradeWallet = buyAndSale.updateWallet(new TradeWallet(1000, 0, 0), 1.0);
        //console.log(tradeWallet.toString());
        expect(tradeWallet.amount).toEqual(2000);
        expect(tradeWallet.googleActionCount).toEqual(0);
        expect(tradeWallet.amazonActionCount).toEqual(0);
    });

    it("should update wallet no gain", async () => {
        let history:ActionPriceHistory = new ActionPriceHistory("g");
        history.addActionPrice(new ActionPrice("g", 0,55,100,null));
        history.addActionPrice(new ActionPrice("g", 4,50,50,null));
        let buyAndSale:BuyAndSale = new BuyAndSale(0, history.getActionPriceCount(), history);
        buyAndSale.calculateOperation();
        const tradeWallet:TradeWallet = buyAndSale.updateWallet(new TradeWallet(1000, 0, 0), 1.0);
        //console.log(buyAndSale.toString());
        //console.log(tradeWallet.toString());
        expect(tradeWallet.amount).toEqual(1000);
        expect(tradeWallet.googleActionCount).toEqual(0);
        expect(tradeWallet.amazonActionCount).toEqual(0);
    });

  });