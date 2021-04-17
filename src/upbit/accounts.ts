import type { Request } from './request';

/**
 * 보유한 자산 정보
 */
export type Asset = {
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
   * 매수평균가
   */
  avg_bug_price: string;
  /**
   * 매수평균가 수정 여부
   */
  avg_buy_price_modified: boolean;
  /**
   * 평단가 기준 화폐
   */
  unit_currency: string;
};

const configureAccount = (request: Request) => {
  /**
   * # 전체 계좌 조회
   * 내가 보유한 자산 리스트를 보여줍니다.
   */
  const accounts = () => request.get<Asset[]>('/v1/accounts')
    .then((res) => res.data);

  return {
    accounts,
  };
};

export default configureAccount;
