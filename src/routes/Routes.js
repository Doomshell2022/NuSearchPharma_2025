import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';

//Screens
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import MyCartScreen from '../screens/MyCartScreen';
import PlaceOrderScreen from '../screens/PlaceOrderScreen';
import SignupScreen from '../screens/SignupScreen';
import OtpScreen from '../screens/OtpScreen';
import LoginScreen from '../screens/LoginScreen';
import LoginOtpScreen from '../screens/LoginOtpScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InviteFriendScreen from '../screens/InviteFriendScreen';
import MyBookingViewMoreScreen from '../screens/MyBookingViewMoreScreen';
import ThankuyouScreen from '../screens/ThankuyouScreen';
import ThankyouScreen from '../screens/ThankuyouScreen';
import ProdcutDetailScreen from '../screens/ProductDetailScreen';

const LoggedOutNavigator = createStackNavigator(
  {
    Signup: SignupScreen,
    Otp: OtpScreen,
    Login: LoginScreen,
    LoginOtp: LoginOtpScreen,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

const HomeNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Product: ProductScreen,
    Product2: ProdcutDetailScreen,
    MyCart: MyCartScreen,
    Place: PlaceOrderScreen,
    // BookingViewMore: MyBookingViewMoreScreen,
    Thankyou: ThankuyouScreen,
    Refer: InviteFriendScreen,
    Notification: NotificationScreen,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: ProfileScreen,
    // Home: HomeNavigator,
    EditProfile: EditProfileScreen,
  },
  {
    initialRouteName: 'Profile',
    headerMode: 'none',
  },
);

const MyBookingNavigator = createStackNavigator(
  {
    Place: PlaceOrderScreen,
    BookingViewMore: MyBookingViewMoreScreen,
    Home: HomeNavigator,
  },
  {
    initialRouteName: 'Place',
    headerMode: 'none',
  },
);

const LoggedInNavigator = createSwitchNavigator(
  {
    Home: HomeNavigator,
    LoggedOut: LoggedOutNavigator,
    Profile: ProfileNavigator,
    Place: MyBookingNavigator,
  },
  {
    initialRouteName: 'Home',
  },
);

export const createRootNavigator = (isLoggedIn) => {
  const ROUTES = {
    LoggedOut: LoggedOutNavigator,
    LoggedIn: LoggedInNavigator,
  };

  let initialRouteName = 'LoggedOut';

  if (isLoggedIn) {
    initialRouteName = 'LoggedIn';
  }

  return createSwitchNavigator(ROUTES, {initialRouteName});
};
