import configureAccount from './upbit/accounts';
import configureRequest, { AuthInfo } from './upbit/request';

const configure = (auth: AuthInfo) => {
  const request = configureRequest(auth);
  const accounts = configureAccount(request);

  return {
    accounts,
  };
};

export default configure;
