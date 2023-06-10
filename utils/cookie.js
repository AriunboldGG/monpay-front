import jsCookie from 'js-cookie';

const clearInfo = () => {
  jsCookie.remove('auth');
  jsCookie.remove('perm');
  localStorage.removeItem('user');
};

export { clearInfo, clearPasswordCookies };
