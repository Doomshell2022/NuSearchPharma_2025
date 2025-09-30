// // API
// import {BASE_URL, makeRequest} from '../api/ApiInfo';

// // User Preference
// import {KEYS, getData} from '../api/UserPreference';

// const uploadToken = async (fcmToken) => {
//   try {
//     // fetching userInfo from local storage
//     // const userInfo = await getData(KEYS.USER_INFO);

//     // if (userInfo) {}
//     // const {id: userId} = userInfo;

//     // preparing params
//     const params = {
//       // userId,
//       token: fcmToken,
//     };

//     // calling api
//     const response = await makeRequest(
//       BASE_URL + 'uploadToken',
//       params,
//       true,
//       false,
//     );
//     return response;
//   } catch (error) {
//     console.log(error.message);
//     return null;
//   }
// };

// export default uploadToken;
