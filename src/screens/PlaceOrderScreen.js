import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Components
import HeaderComponent from '../components/HeaderComponent';
import PlaceOrderComponent from '../components/PlaceOrderComponent';
import FooterComponent from '../components/FooterComponent';
import CustomLoader from '../components/CustomLoader';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';

import {KEYS, clearData, getData, storeData} from '../api/UserPreference';

export default class PlaceOrderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isListRefreshing: false,
      Orders: null,
      status: null,
      notificationCount: 0,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchBookings();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = async () => {
    try {
      this.props.navigation.push('Home');
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchBookings = async () => {
    try {
      //this.setState({isLoading: true});
      let params = null;

      //  calling api
      const response = await makeRequest(
        BASE_URL + 'orderDetail',
        params,
        true,
        false,
      );

      // processing response
      if (response) {
        const {success, isAuthTokenExpired} = response;

        if (success) {
          const {Orders} = response;
          this.setState({
            Orders,
            status: null,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;
          this.setState({
            status: message,
            Orders: null,
            isLoading: false,
            isListRefreshing: false,
          });
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: false,
              },
            );
            this.handleTokenExpire();
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('Login');
    } else {
      console.log('There is an error in sign-out');
    }
  };
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <PlaceOrderComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {Orders, status, notificationCount} = this.state;
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="My Booking"
          // navAction="back"
          nav={this.props.navigation}
        />
        {Orders ? (
          <View style={styles.flatContainer}>
            <FlatList
              data={Orders}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
        ) : (
          <View style={styles.infoTextStyle}>
            <Text>{status}</Text>
          </View>
        )}
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatContainer: {
    flex: 1,
  },
  listContainer: {
    padding: wp(2),
  },
  separator: {
    height: wp(2),
  },
  infoTextStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
