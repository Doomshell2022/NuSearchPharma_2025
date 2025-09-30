// import {Platform} from 'react-native';
// import {nsNavigate} from '../routes/NavigationService';
// // import firebase from '@react-native-firebase/app';
// import uploadToken from './UploadTokenAPI';
// import {homeScreenFetchNotificationCount} from '../screens/HomeScreen';

// export let isAppOpenedByRemoteNotificationWhenAppClosed = false;

// const createAndroidNotificationChannel = () => {
//   try {
//     const channel = new firebase.notifications.Android.Channel(
//       'nusearch',
//       'nusearch channel',
//       firebase.notifications.Android.Importance.Max,
//     ).setDescription('nusearch app channel');

//     firebase.notifications().android.createChannel(channel);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const checkPermission = async () => {
//   try {
//     const enabled = await firebase.messaging().hasPermission();

//     if (enabled) {
//       if (Platform.OS === 'android') {
//         createAndroidNotificationChannel();
//       }

//       await getToken();
//     } else {
//       await requestPermission();
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// const requestPermission = async () => {
//   try {
//     await firebase.messaging().requestPermission();

//     if (Platform.OS === 'android') {
//       createAndroidNotificationChannel();
//     }

//     await getToken();
//   } catch (error) {
//     console.log('User has rejected permission:', error.message);
//   }
// };

// const getToken = async () => {
//   try {
//     const fcmToken = await firebase.messaging().getToken();

//     if (fcmToken) {
//       const response = await uploadToken(fcmToken);

//       if (response && response.success !== true) {
//         await uploadToken(fcmToken);
//       }
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// const onTokenRefreshCallback = async (fcmToken) => {
//   try {
//     if (fcmToken) {
//       const response = await uploadToken(fcmToken);

//       if (response && response.success !== 1) {
//         await uploadToken(fcmToken);
//       }
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const createOnTokenRefreshListener = (thisArg) => {
//   thisArg.onTokenRefreshListener = firebase
//     .messaging()
//     .onTokenRefresh(onTokenRefreshCallback);
// };

// export const removeOnTokenRefreshListener = (thisArg) => {
//   if (thisArg.onTokenRefreshListener) {
//     thisArg.onTokenRefreshListener();
//     thisArg.onTokenRefreshListener = null;
//   }
// };

// export const createNotificationListeners = async (thisArg) => {
//   const onNotificationCallback = async (notification) => {
//     notification.setSound('default');

//     if (Platform.OS === 'android') {
//       notification.android
//         .setAutoCancel(true)
//         .android.setColor('#056393')
//         .android.setSmallIcon('ic_notification')
//         .android.setChannelId('nusearch')
//         .android.setPriority(firebase.notifications.Android.Priority.Max);
//     }

//     firebase.notifications().displayNotification(notification);

//     if (homeScreenFetchNotificationCount) {
//       await homeScreenFetchNotificationCount();
//     }
//   };

//   // thisArg.onNotificationListener = firebase
//   //   .notifications()
//   //   .onNotification(onNotificationCallback);

//   // thisArg.onNotificationOpenedListener = firebase
//   //   .notifications()
//   //   .onNotificationOpened((notificationOpen) => {
//   //     nsNavigate('Notification');
//   //   });

//   const initialNotification = await firebase
//     .notifications()
//     .getInitialNotification();

//   if (initialNotification) {
//     isAppOpenedByRemoteNotificationWhenAppClosed = true;
//   }
// };

// export const removeNotificationListeners = (thisArg) => {
//   // Remove listeners allocated in createNotificationListeners()
//   // thisArg.onNotificationListener();
//   // thisArg.onNotificationOpenedListener();
// };

// export const resetIsAppOpenedByRemoteNotificationWhenAppClosed = () => {
//   isAppOpenedByRemoteNotificationWhenAppClosed = false;
// };
