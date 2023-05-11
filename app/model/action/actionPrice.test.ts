import { ActionPrice } from "./actionPrice";

describe("actionPrice Test", () => {
    it("should no price", async () => {
        const actionPrice:ActionPrice = new ActionPrice("g", 0,100,50,null);
        expect(actionPrice.getAmount(1)).toEqual(0);
    });

    it("should one highest price", async () => {
        const actionPrice:ActionPrice = new ActionPrice("g", 0,100,50,"sale");
        expect(actionPrice.getAmount(1)).toEqual(100);
    });

    it("should one lowest price", async () => {
        const actionPrice:ActionPrice = new ActionPrice("g", 0,100,50,"buy");
        expect(actionPrice.getAmount(1)).toEqual(50);
    });

    it("should many lowest price", async () => {
        const actionPrice:ActionPrice = new ActionPrice("g", 0,100,50,"buy");
        expect(actionPrice.getAmount(10)).toEqual(500);
    });
  });