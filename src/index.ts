import configureAccount from './upbit/accounts';
import configureOrders from './upbit/orders';
import configureRequest, { AuthInfo } from './upbit/request';

const configure = (auth: AuthInfo) => {
  const request = configureRequest(auth);
  const accounts = configureAccount(request);
  const orders = configureOrders(request);

  return {
    accounts,
    orders,
  };
};

export default configure;
