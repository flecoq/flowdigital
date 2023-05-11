export class TradeWallet {
    public amount: number;
    public googleActionCount: number;
    public amazonActionCount: number;

    constructor(amount: number, googleActionCount: number, amazonActionCount: number) { 
        this.amount = amount;
        this.googleActionCount = googleActionCount;
        this.amazonActionCount = amazonActionCount;
    }

    public clone():TradeWallet {
        return new TradeWallet(this.amount, this.googleActionCount, this.amazonActionCount);
     }

    public toString():string {
        return "wallet: {amount: " + this.amount + "; googleActionCount:" + this.googleActionCount + "; amazonActionCount:" + this.amazonActionCount + "}"
    }

}