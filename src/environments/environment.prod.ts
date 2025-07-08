const pathInfo = window.location.pathname.split('/');
let apiURL = window.location.origin;
if (pathInfo.length > 3) apiURL += '/' + pathInfo.slice(1, -2).join('/');
export const environment = {
  production: true,
  reportDataLimit: 500,
  apiURL: apiURL,
  BACKEND_URL: apiURL + '/reports/dashboard/',
  CUSTOME_BACKEND_URL: apiURL + '/reports/custom-report/',
  COMMON_URL: apiURL + '/reports/common/',
  ROOT_BACKEND_URL: apiURL + '/reports/',
  REQUEST_URL: apiURL + '/reports/historydetails/',
};
