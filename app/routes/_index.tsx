import type { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { TradeService } from "app/service/tradeService";
import { TradeOperation } from "app/model/trading/tradeOperation";
import { Operation } from "./view/operation";
import { TradeCase } from "app/model/trading/tradeCase";
import { BuyAndSale } from "app/model/trading/buyAndSale";

import Table from 'react-bootstrap/Table';
import { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; 

export const meta: V2_MetaFunction = () => {
  return [{ title: "rich-app" }];
};

export const loader = async () => {
  const service:TradeService = new TradeService;
  await service.load();
  service.calculateFeat1();
  service.calculateFeat2();
  service.calculateFeat3(49);
  return service;
};

export default function Index() {
  const service:TradeService = useLoaderData() as TradeService;

  //console.log(service.googleHistory);
  //console.log(service.amazoneHistory);

  // feat 1
  console.log(service.googleGraphData);
  console.log(service.amazonGraphData);
  const ref = useRef();
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Amazon",
        data: service.amazonGraphData,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: "Google",
        data: service.googleGraphData,
        fill: false,
        borderColor: "#742774"
      }
    ]
  };

  // feat 2
  // Aymen
  const buyOperationAymen:Operation = new Operation((service.buyAndSaleAymen as BuyAndSale).buyOperation as TradeOperation);
  const saleOperationAymen:Operation = new Operation((service.buyAndSaleAymen as BuyAndSale).saleOperation as TradeOperation);
  // Anouar
  const buyOperationAnouar:Operation = new Operation((service.buyAndSaleAnouar as BuyAndSale).buyOperation as TradeOperation);
  const saleOperationAnouar:Operation = new Operation((service.buyAndSaleAnouar as BuyAndSale).saleOperation as TradeOperation); 

  // feat 3
  let operationList:Operation[] = [];
  for(let tradeOperation of (service.tradeCase as TradeCase).tradeOperationList) {
    if( tradeOperation ) {
      operationList.push(new Operation(tradeOperation));
    }
  }
  //console.log(operationList);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>FEAT 1</h2>
      <Line ref={ref} data={data} width="600"/>
      <h2>FEAT 2</h2>
      <p>Aymen devrait acheter 100 000 € d'action Amazon le {buyOperationAymen.date} au prix de {buyOperationAymen.price} €<br/>
      Il devrait ensuite vendre ces actions le {saleOperationAymen.date} au prix de {saleOperationAymen.price} € pour faire un gain de {saleOperationAymen.walletAmount} €
      </p>
      <p>Anouar devrait acheter 100 000 € d'action Google le {buyOperationAnouar.date} au prix de {buyOperationAnouar.price} €<br/>
      Il devrait ensuite vendre ces actions le {saleOperationAnouar.date} au prix de {saleOperationAnouar.price} € pour faire un gain de {saleOperationAnouar.walletAmount} €
      </p>
      <h2>FEAT 3 ({service.timer} ms)</h2>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>DATE</th>
          <th>ACTION</th>
          <th>NAME</th>
          <th>PRIX UNITAIRE</th>
          <th>NOMBRE D'ACTIONS</th>
          <th>TOTAL</th>
          <th>PORTEFEUILLE</th>
        </tr>
      </thead>
      <tbody>
      {operationList.map((item, i) => {
          return (
              <tr key={i}>
                  <td key={i+"date"}>{item.date}</td>
                  <td key={i+"action"} align="center">{item.action}</td>
                  <td key={i+"name"} align="center">{item.name}</td>
                  <td key={i+"price"} align="right">{item.price}</td>
                  <td key={i+"count"} align="center">{item.count}</td>
                  <td key={i+"total"} align="right">{item.total}</td>
                  <td key={i+"amount"} align="right">{item.walletAmount}</td>
              </tr>
          );
        })}
      </tbody>
    </Table>
    </div>
  );
}
