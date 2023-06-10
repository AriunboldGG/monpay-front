export default class authNew {
  static setToken(token, expires_in) {
    let now = new Date();
    let expiryDate = new Date(now.getTime() + (expires_in / 60) * 60 * 1000);
    Cookies.set('auth_token', token);
    Cookies.set('auth_tokenExpires_in', expiryDate);
  }

  static destroyToken() {
    Cookies.remove('auth_token');
    Cookies.remove('auth_tokenExpires_in');
  }

  static getToken() {
    var token = Cookies.get('auth_token');
    var expiration = Cookies.get('auth_tokenExpires_in');

    if (!token || !expiration) return null;

    if (Date.now() > Date.parse(expiration)) {
      this.destroyToken();
      return null;
    }

    return token;
  }

  static loggedIn() {
    return !!this.getToken();
  }
}
