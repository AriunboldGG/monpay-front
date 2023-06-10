export const setHeaders = (req, useAuthorization = true, isPerm = false) => {
  const header = {
    'Accept-Language': req.cookies.NEXT_LOCALE ?? 'mn',
  };
  if (useAuthorization) {
    const token = isPerm ? req.cookies?.perm : req.cookies?.auth;
    header['Authorization'] = `Bearer ${token}`;
  }
  return header;
};
