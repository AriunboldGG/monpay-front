 export const validateEmail =(value) => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  }
  
  export const validateUsername = (value) => {
    let error;
    if (value === 'admin') {
      error = 'Nice try!';
    }
    return error;
  }


/**
 * Slash
 */
// export const ictTrailingSlashIt = (url) => {
//   while ( url.charAt(url.length - 1) == "/" ) {
//       url = url.substring(0,url.length-1);
//   }
//   return url+'/';
// }

export const ictRmMultiSlashes = ( url ) => {
  if ( url && typeof url === 'string' ){
    return url.replace(/\/+/g, '/');
  }
  return ''
}
export const ictTrimSlashes = ( url ) => {
  let count = url.length - 1
  let index = 0

  while (url.charCodeAt(index) === 47 && ++index);
  while (url.charCodeAt(count) === 47 && --count);

  url = url.slice(index, count + 1)

  return url;
}

export const ictLocaleLinkPre = ( locale, def='' ) => locale==='mn' ? def : ( '/' + locale )

/* Number Format */
export const ictCurrencyFormat = num => parseFloat(isNaN(num)?0:num,10).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

/* Number Pad */
export const ictNumberPad      = ( num, size ) => {
    var s = String(num);
    while (s.length < ( size || 2 ) ) { s = "0" + s }
    return s
}