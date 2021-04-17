import type { Request } from './request';

/**
 * 매수/매도시 제약 사항
 */
export type OrderConstraint = {
  /**
   * 화폐를 의미하는 영문 대문자 코드
   */
  currency: string;
  /**
   * 주문금액 단위
   */
  price_unit: string | null;
  /**
   * 최소 매도/매수 금액
   */
  min_total: string;
};

export type MarketInfo = {
  /**
   * 마켓의 유일 키
   */
  id: string;
  /**
   * 마켓 이름
   */
  name: string;
  /**
   * 지원 주문 방식
   */
  order_types: string[];
  /**
   * 지원 주문 종류
   */
  order_side: string[];
  /**
   * 매수 시 제약사항
   */
  bid: OrderConstraint;
  /**
   * 매도 시 제약사항
   */
  ask: OrderConstraint;
  /**
   * 최대 매도/매수 금액
   */
  max_total: string;
  /**
   * 마켓 운영 상태
   */
  state: string;
}

/**
 * 화폐 계좌 상태
 */
export type AccountState = {
  /**
   * 화폐를 의미하는 영문 대문자 코드
   */
  currency: string;
  /**
   * 주문가능 금액/수량
   */
  balance: string;
  /**
   * 주문 중 묶여있는 금액/수량
   */
  locked: string;
  /**
   * 매수/매도 평균가
   */
  avg_buy_price: string;
  /**
   * 매수/매도 평균가 수정 여부
   */
  avg_buy_price_modified: boolean;
  /**
   * 평단가 기준 화폐
   */
  unit_currency: string;
};

export type MarketOrderInfo = {
  /**
   * 매수 수수료 비율
   */
  bid_fee: string;
  /**
   * 매도 수수료 비율
   */
  ask_fee: string;
  maker_bid_fee: string;
  maker_ask_fee: string;
  /**
   * 마켓에 대한 정보
   */
  market: MarketInfo;
  /**
   * 매도 시 사용하는 화폐의 계좌 상태
   */
  ask_account: AccountState;
  /**
   * 매수 시 사용하는 화폐의 계좌 상태
   */
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
