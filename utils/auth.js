import Router from 'next/router';

export const getToken = () => {
  return jsCookie.get('token');
};

export const getProfile = () => {
  const profile = jsCookie.get('profile');
  return profile ? JSON.parse(profile) : {};
};

export const isLoggedIn = () => {
  return !!jsCookie.get('token');
};

export const logout = () => {
  jsCookie.remove('token');
  jsCookie.remove('profile');
  jsCookie.remove('loginError');
  Router.replace('/login');
};
