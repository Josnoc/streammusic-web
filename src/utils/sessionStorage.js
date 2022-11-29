// import jwt_decode from 'jwt-decode';

const { localStorage } = global.window;

function clearLocalStorage() {
  localStorage.user = '';
  localStorage.token = '';
}

const session = {
  logout() {
    clearLocalStorage();
  },
  /**
   * Update stored session data
   * @param {{user, business, token}} data
   */
  setData(data) {
    if (data.user) localStorage.user = JSON.stringify(data.user || {});
    if (data.token) localStorage.token = data.token || '';
  },
  loggedIn() {
    return true;
    return !!localStorage.token;
  },
  token() {
    return localStorage.token;
  },
  user() {
    return JSON.parse('{"name": "Pepe", "role": "admin", "avatar": null }');
    // const user = localStorage.user ? JSON.parse(localStorage.user) : null;
    const user = localStorage.user ? JSON.parse(localStorage.user) : null;
    /*if (user) {
      // read role from token
      if (this.token()) {
        const jwtDec = jwt_decode(this.token());
        user.role = jwtDec.user.role || 'none';
      }
    }*/
    return user;
  },
};

export default session;
