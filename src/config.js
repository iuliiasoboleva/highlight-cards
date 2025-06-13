
let BASE_URL = process.env.REACT_APP_API_URL;

if (!BASE_URL) {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    BASE_URL = 'http://localhost:8000/';
  } else {
    BASE_URL = 'http://147.45.229.94:8000/';
  }
}

export default BASE_URL;
