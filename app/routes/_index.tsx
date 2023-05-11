import type { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { TradeService } from "app/service/tradeService";
import { TradeOperation } from "app/model/trading/tradeOperation";
import { Operation } from "./view/operation";
import { TradeCase } from "app/model/trading/tradeCase";
import { BuyAndSale } from "app/model/trading/buyAndSale";

export const meta: V2_MetaFunction = () => {
  return [{ title: "rich-app" }];
};

export const loader = async () => {
  const service:TradeService = new TradeService;
  await service.load();
  service.calculateFeat2();
  service.calculateFeat3();
  return service;
};

export default function Index() {
  const service:TradeService = useLoaderData() as TradeService;

  //console.log(service.googleHistory);
  //console.log(service.amazoneHistory);

  // feat 2
  // Aymen
  const buyOperationAymen:Operation = new Operation((service.buyAndSaleAymen as BuyAndSale).buyOperation as TradeOperation);
  const saleOperationAymen:Operation = new Operation((service.buyAndSaleAymen as BuyAndSale).saleOperation as TradeOperation);
  console.log("feat 2");
  console.log("aymen");
  console.log(buyOperationAymen);
  console.log(saleOperationAymen);
  // Anouar
  const buyOperationAnouar:Operation = new Operation((service.buyAndSaleAnouar as BuyAndSale).buyOperation as TradeOperation);
  const saleOperationAnouar:Operation = new Operation((service.buyAndSaleAnouar as BuyAndSale).saleOperation as TradeOperation);
  console.log("feat 2");
  console.log("Anouar");
  console.log(service.buyAndSaleAnouar);
  console.log(buyOperationAnouar);
  console.log(saleOperationAnouar);  

  // feat 3
  console.log("feat 3");
  //console.log(service.tradeCase);
  //console.log(service.gain);
  let operationList:Operation[] = [];
  for(let tradeOperation of (service.tradeCase as TradeCase).tradeOperationList) {
    if( tradeOperation ) {
      operationList.push(new Operation(tradeOperation));
    }
  }
  console.log(operationList);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to rich-app</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
