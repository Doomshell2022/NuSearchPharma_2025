import React, {Component} from 'react';
import {Alert, Linking, LogBox, Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {RootSiblingParent} from 'react-native-root-siblings';

// Splash Screen
import SplashScreen from './src/screens/SplashScreen';

// User Preference
import {KEYS, getData} from './src/api/UserPreference';

// Routes
import {createRootNavigator} from './src/routes/Routes';
import {nsSetTopLevelNavigator} from './src/routes/NavigationService';

import {SafeAreaProvider} from 'react-native-safe-area-context';

// Firebase API
// import {
//   checkPermission,
//   createOnTokenRefreshListener,
//   removeOnTokenRefreshListener,
//   createNotificationListeners,
//   removeNotificationListeners,
// } from './src/firebase_api/FirebaseAPI';
import {BASE_URL, makeRequest} from './src/api/ApiInfo';
import deviceInfoModule from 'react-native-device-info';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isLoggedIn: false,
    };
  }
  // update = async () => {
  //   if (Platform.OS !== 'android') return; // Exit if not on Android

  //   try {
  //     const buildNumber = deviceInfoModule.getBuildNumber();
  //     console.log('====================================');
  //     console.log('@#@~@~', buildNumber);
  //     console.log('====================================');

  //     const params = {
  //       build_no: buildNumber,
  //     };

  //     const response = await makeRequest(
  //       BASE_URL + 'versioncheck',
  //       params,
  //       false,
  //       false,
  //     );

  //     const {success, app_url, message} = response;
  //     if (success === false) {
  //       Alert.alert('Update', message, [
  //         {
  //           text: 'Update',
  //           onPress: () => {
  //             Linking.openURL(app_url); // This will open the URL in the default browser
  //           },
  //         },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  componentDidMount() {
    // this.update();
    try {
      setTimeout(this.initialSetup, 4000);

      // Adding firebase listeners
      // createOnTokenRefreshListener(this);
      // createNotificationListeners(this);
    } catch (error) {
      console.log(error.message);
    }
  }

  componentWillUnmount() {
    // Removing firebase listeners
    // removeOnTokenRefreshListener(this);
    // removeNotificationListeners(this);
  }

  initialSetup = async () => {
    try {
      // Fetching userInfo
      // checking fcm permission
      // await checkPermission();

      const userInfo = await getData(KEYS.USER_INFO);
      const isLoggedIn = userInfo ? true : false;

      this.setState({
        isLoggedIn,
        isLoading: false,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  setNavigatorRef = (ref) => {
    nsSetTopLevelNavigator(ref);
  };

  render() {
    const {isLoading, isLoggedIn} = this.state;

    if (isLoading) {
      return <SplashScreen />;
    }

    const RootNavigator = createRootNavigator(isLoggedIn);
    const AppContainer = createAppContainer(RootNavigator);
    return (
      <RootSiblingParent>
        <SafeAreaProvider>
          <AppContainer ref={this.setNavigatorRef} />
        </SafeAreaProvider>
      </RootSiblingParent>
    );
  }
}
