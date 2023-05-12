import { TradeOperation } from "./tradeOperation";
import { TradeWallet } from "./tradeWallet";
import { ActionPrice } from "../action/actionPrice";
import { ActionPriceHistory } from "../action/actionPriceHistory";

/**
 * Achat et vente d'une action
 * 
 * beginIndex: index de la 1ère actionPrice étudiée dans actionPriceHistory
 * endIndex: index de la dernière + 1 actionPrice étudiée dans actionPriceHistory
 * actionPriceHistory: historique du cours de l'action
 * buyOperation: opération d'achat
 * sale: opération de vente
 * 
 * buyIndex: index de l'action d'achat dans actionPriceHistory
 * saleIndex: index de l'action de vente dans actionPriceHistory
 * gain: gain résultat de l'opération d'achat et de vente
 * 
 */
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

    /**
     * Calcule simple des indexes des actions d'achat et de vente
     * 
     * Ce calcul est basé sur la recherche des valeurs min et max du cours de l'action
     * Il vérifie que l'acte d'achat précède l'acte de vente
     * Il calcule le gain réalisé
     * 
     */
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

    /**
     * Calcule pas à pas des indexes des actions d'achat et de vente
     * 
     * Ce calcul est basé sur la recherche de la combinaison achat et vente pour un gain maximum
     * L'ensemble des combinaisons est issu d'une double boucle où l'achat précède la vente
     * Il calcule le gain réalisé
     * 
     */
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

    /**
     * Calcule final des indexes des actions d'achat et de vente
     * 
     * Ce calcul lance en 1er lien le calcul simple
     * Si celui ne donne pas de résultat, le calcul pas à pas est lancé
     * 
     */
    public calculateOperation(): void {
        this.calculateOperationSimplest();
        if( this.buyIndex < 0) {
            console.log("buyAndSale.calculateOperationLoop() required");
            this.calculateOperationLoop();
        }
    }

     /**
     * Instancie buyOperation et saleOperation sur la base des indexes buyIndex et saleIndex calculés
     * 
     */
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

    /**
     * Crée une nouvelle instance du portefeuille, mise à jour par l'opération d'achat et de vente
     * 
     * @param tradeWallet portefeuille d'origine
     * @param buyPercent ratio sur la valeur du portefeuille dédiée pour l'achat des actions
     * @return nouvelle instance du portefeuille
     * 
     */
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