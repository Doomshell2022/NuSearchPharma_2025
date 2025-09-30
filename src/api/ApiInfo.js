// Utility
import {encryptData} from './EncryptionUtility';

// User Preference
import {KEYS, getData} from './UserPreference';

// Base URL
// export const BASE_URL = 'https://nusearchpharma.com/api/Mobile/';
export const BASE_URL = 'https://nusearchpharma.com/api/Mobiletest/';

// Methods
export const makeRequest = async (
  url,
  params = null,
  sendAuthorizationToken = true,
  isContentTypeJSON = true,
) => {
  try {
    // request info
    let info = {};

    if (params) {
      // request method
      info.method = 'POST';

      if (sendAuthorizationToken) {
        // fetching userInfo
        const userInfo = await getData(KEYS.USER_INFO);
        if (!userInfo) {
          console.log('Unable to fetch user info');
          return null;
        }

        const {authToken} = userInfo;

        info.headers = {
          Authorization: 'Bearer ' + authToken,
        };
      }

      // request body
      // console.log("Request params:", params);
      if (isContentTypeJSON) {
        // request headers
        info.headers = {
          ...info.headers,
          'Content-Type': 'application/json',
        };

        const data = JSON.stringify(params);
        const payload = await encryptData(data);
        const requestBody = {payload};
        info.body = JSON.stringify(requestBody);
      } else {
        // preparing multipart/form-data
        const formData = new FormData();
        for (const key in params) {
          formData.append(key, params[key]);
        }
        info.body = formData;
      }
    } else {
      if (sendAuthorizationToken) {
        // fetching userInfo
        const userInfo = await getData(KEYS.USER_INFO);
        if (!userInfo) {
          console.log('Unable to fetch user info');
          return null;
        }

        const {authToken} = userInfo;

        info.headers = {
          Authorization: 'Bearer ' + authToken,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        };
      } else {
        // headers to prevent cache in GET request
        info.headers = {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        };
      }
    }

    console.log('Request URL:', url);
    console.log('Request Info:', info);

    // request body
    console.log('Request params:', params);
    const response = await fetch(url, info);
    console.log('Request Response:', response);

    const result = await response.json();
    console.log('Request Result:', result);

    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
