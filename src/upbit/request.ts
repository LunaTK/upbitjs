import axios, { AxiosError } from 'axios';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import { v4 as uuidv4 } from 'uuid';

const server_url = 'https://api.upbit.com';

export type AuthInfo = {
  access_key: string;
  secret_key: string;
};

export type Payload = {
  access_key: string;
  nonce: string;
  query_hash?: string;
  query_hash_alg?: 'SHA512';
};

type CodeBadRequest =
  | 'create_ask_error'
  | 'create_bid_error'
  | 'insufficient_funds_ask'
  | 'insufficient_funds_bid'
  | 'under_min_total_ask'
  | 'under_min_total_bid'
  | 'withdraw_address_not_registerd'
  | 'validation_error'
  ;

type CodeUnauthorized =
  | 'invalid_query_payload'
  | 'jwt_verification'
  | 'expired_access_key'
  | 'nonce_used'
  | 'no_authorization_i_p'
  | 'out_of_scope'
  ;

export type UpbitApiError<
  T extends CodeBadRequest | CodeUnauthorized = CodeBadRequest | CodeUnauthorized
> = {
  /**
   * 오류에 대한 설명
   */
  message: string;
  /**
   * 오류 코드
   */
  name: T;
}

export type BadRequestError = UpbitApiError<CodeUnauthorized>;
export type UnauthorizedError = UpbitApiError<CodeBadRequest>;

const configureRequest = ({ access_key, secret_key }: AuthInfo) => {
  const createSignedPayload = (params?: querystring.ParsedUrlQueryInput) => {
    const createPayload = (): Payload => {
      const payload: Payload = {
        access_key,
        nonce: uuidv4(),
      };

      if (params) {
        const query = querystring.encode(params);
        const hash = crypto.createHash('sha512');
        const query_hash = hash.update(query, 'utf-8').digest('hex');

        payload.query_hash = query_hash;
        payload.query_hash_alg = 'SHA512';
      }

      return payload;
    };

    const signPayload = (payload: Payload) => jwt.sign(payload, secret_key);

    return signPayload(createPayload());
  };

  const createOptions = (params?: querystring.ParsedUrlQueryInput) => {
    const token = createSignedPayload(params);

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  /**
   * response에서 Upbit의 Api Error를 추출해 내어 re-throw
   */
  const rethrowUpbitError = (err: AxiosError) => {
    if (err.isAxiosError && err.response) {
      switch (err.response.status) {
        case 400: // Bad Request
          throw (err.response.data.error as BadRequestError);
        case 401: // Unauthorized
          throw (err.response.data.error as UnauthorizedError);
        default:
          throw err.response;
      }
    }
    throw err;
  };

  const get = <T>(
    url: string,
    params?: querystring.ParsedUrlQueryInput,
  ) => axios.get<T>(`${server_url}${url}`, createOptions(params)).catch(rethrowUpbitError);

  const post = <T>(
    url: string,
    params?: querystring.ParsedUrlQueryInput,
  ) => axios.post<T>(`${server_url}${url}`, params, createOptions(params)).catch(rethrowUpbitError);

  return {
    get,
    post,
  };
};

export default configureRequest;

export type Request = ReturnType<typeof configureRequest>;
