import React, { useEffect, useState } from 'react';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';

const IctContext = React.createContext({
  user: null,
  info: null,
  setLogin: (val) => {},
  setLogout: () => {},
  setUserInfo: (val) => {},
  setTransfer: (val) => {},
  setBillInfoAmount: (val) => {},
  setBill: (val) => {},
  setLoan: (val) => {},
  setMax: (val) => {},
  setToken: (val) => {},
  setPaswoard: (val) => {},
  setRepay: (val) => {},
  setPinStatus: (val) => {},
  setSelect: (val) => {},
  authReady: false,
});

export const IctProvider = (props) => {
  const [ictCtx, setIctCtx] = useState({});
  const [pagingStart, setPagingStart] = useState('');
  const [user, setUser] = useState(null);
  const [info, setInfo] = useState(null);
  const [hasPin, setHasPin] = useState(false);
  const [transferInfo, setTransferInfo] = useState(null);
  const [billInfo, setBillInfo] = useState(null);
  const [loanInfo, setLoanInfo] = useState(null);
  const [loanRepayInfo, setRepayInfo] = useState(null);
  const [tokenPerm, setTokenPerm] = useState(null);
  const [paswoardPerm, setPaswoardPerm] = useState(null);

  const [authorized, setAuthorized] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [billAmount, setBillAmount] = useState('');
  const [selectId, setSelectId] = useState('');

  const [maxLoan, setMaxLoan] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const authToken = jsCookie.get('auth');
    const permToken = jsCookie.get('perm');
    const userFromStorage = localStorage.getItem('user');

    if (router.pathname?.startsWith('/app')) {
      if (!authToken || !permToken) {
        setLogout();
      } else {
        if (!userFromStorage) {
          setLogout();
          router.push('/login');
        } else {
          setUser(JSON.parse(userFromStorage));
        }
      }
    } else if (
      !router.pathname?.includes('registration/pin') &&
      router.pathname?.match('(login|registration|forgot-password)') &&
      JSON.parse(localStorage.getItem('user'))?.pin
    ) {
      if (authToken && permToken) return router.push('/app/dashboard');
    }
  }, [authorized, router.pathname]);

  const setLogin = (val) => {
    localStorage.setItem('user', JSON.stringify(val));
    setUser(val);
    setAuthorized(true);
  };

  const checkPin = () => {
    const userFromStorage = localStorage.getItem('user');
    return userFromStorage && JSON.parse(userFromStorage).pin;
  };

  const setUserInfo = (val) => {
    const now = new Date();
    val.lastUpdated = now.getTime();
    setInfo({ ...val });
  };

  const setTransfer = (val) => {
    setTransferInfo(val);
  };
  const setBillInfoAmount = (val) => {
    setBillAmount(val);
  };
  const notifyAlert = (val) => {
    setAlerts([...alerts, val]);
  };

  const clearAlert = () => {
    setAlerts([]);
  };
  const setBill = (val) => {
    setBillInfo(val);
  };
  const setMax = (val) => {
    setMaxLoan(val);
  };

  const setLoan = (val) => {
    setLoanInfo(val);
  };

  const setRepay = (val) => {
    setRepayInfo(val);
  };
  const setToken = (val) => {
    setTokenPerm(val);
  };
  const setPaswoard = (val) => {
    setPaswoardPerm(val);
  };

  const setPinStatus = (val) => {
    setHasPin(val);
  };
  const setSelect = (val) => {
    setSelectId(val);
  };

  const setLogout = () => {
    setUser(null);
    setInfo(null);
    setAuthorized(false);
    setHasPin(false);
    clear();
    router.push('/login', undefined, { locale: router.locale });
  };

  const clear = () => {
    setTransferInfo(null);
    setBillInfo(null);
    setLoanInfo(null);
    setRepayInfo(null);
    setTokenPerm(null);
    setPaswoard(null);
    localStorage.removeItem('user');
    jsCookie.remove('auth');
    jsCookie.remove('perm');
    jsCookie.remove('phone');
    jsCookie.remove('passwordToken');
  };
  return (
    <IctContext.Provider
      value={{
        pagingStart,
        ictCtx,
        user,
        info,
        transferInfo,
        loanRepayInfo,
        billInfo,
        loanInfo,
        authorized,
        hasPin,
        maxLoan,
        tokenPerm,
        alerts,
        billAmount,
        paswoardPerm,
        selectId,
        setPagingStart,
        setUser,
        setIctCtx,
        setLogin,
        setLogout,
        setUserInfo,
        setTransfer,
        setPaswoard,
        setBillInfoAmount,
        setBill,
        setMax,
        setLoan,
        setSelect,
        setRepay,
        setToken,
        setPinStatus,
        checkPin,
        notifyAlert,
        clearAlert,
      }}
    >
      {props.children}
    </IctContext.Provider>
  );
};

export default IctContext;
