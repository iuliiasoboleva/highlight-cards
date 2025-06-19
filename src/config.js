let BASE_URL = process.env.REACT_APP_API_URL;

if (!BASE_URL) {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    BASE_URL = 'http://localhost:8000/';
  } else {
    BASE_URL = '/';
  }
}

export default BASE_URL;
