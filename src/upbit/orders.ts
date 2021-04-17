import type { Request } from './request';

export type OrderConstraint = {
  currency: string;
  price_unit: string | null;
  min_total: string;
};

export type MarketInfo = {
  id: string;
  name: string;
  order_types: string[];
  order_side: string[];
  bid: OrderConstraint;
  ask: OrderConstraint;
  max_total: string;
  state: string;
}

export type AccountState = {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  avg_buy_price_modified: boolean;
  unit_currency: string;
};

export type MarketOrderInfo = {
  bid_fee: string;
  ask_fee: string;
  maker_bid_fee: string;
  maker_ask_fee: string;
  market: MarketInfo;
  ask_account: AccountState;
  bid_account: AccountState;
};

const configureOrders = (request: Request) => {
  /**
   * # 주문 가능 정보
   * 마켓별 주문 가능 정보를 확인한다.
   */
  const chance = (market: string) => request.get<MarketOrderInfo>('/v1/orders/chance', {
    market,
  }).then((res) => res.data);

  return {
    chance,
  };
};

export default configureOrders;
