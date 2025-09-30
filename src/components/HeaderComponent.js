import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

// Icons

import ic_backarrow from '../assets/icons/ic_backarrow.png';
//import ic_search from '../assets/icons/ic_search.png';
import ic_cart from '../assets/icons/ic_cart.png';
import ic_home_white from '../assets/icons/ic_home_white.png';
import ic_whiteSearch from '../assets/icons/ic_whiteSearch.png';
import ic_notifications from '../assets/icons/ic_notifications.png';

// User Preference
import {KEYS, getData, storeData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartItemCount: 0,
      notificationCount: 0,
    };
  }

  intervalID;

  componentDidMount = async () => {
    if (this.props.showCartIcon) {
      this.fetchCartItemsCount();
    }

    if (this.props.showNotificationIcon) {
      this.fetchNotificationCount();
    }
  };

  fetchCartItemsCount = async () => {
    try {
      const cartInfo = await getData(KEYS.CART_ITEM_COUNT);

      const {cartItemCount} = cartInfo;
      if (cartItemCount) {
        console.log(cartItemCount);
        this.setState({cartItemCount});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchNotificationCount = async () => {
    try {
      const notificationInfo = await getData(KEYS.NOTIFICATION_COUNT);

      const {notificationCount} = notificationInfo;
      if (notificationCount) {
        // console.log(notificationCount);npx react-native
        this.setState({notificationCount});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  toggleDrawer = () => {
    const {headerTitle} = this.props;
    if (headerTitle !== 'Home') {
      this.props.nav.navigate('Home');
    }
  };

  // handleBack = () => {
  //   const {headerTitle, tapNote} = this.props;
  //   if (headerTitle === 'My Cart') {
  //     if (tapNote === 'HomeTap') {
  //       console.log(tapNote);
  //       this.props.nav.push('Home');
  //     } else if (tapNote === 'productTap') {
  //       const {tapNote, items} = this.props;
  //       let item = items;
  //       console.log(tapNote);
  //       this.props.nav.push('Product', {item});
  //     }
  //   } else if (headerTitle === 'Product List') {
  //     this.props.nav.push('Home');
  //   } else {
  //     console.log('Navigation Back');
  //     this.props.nav.pop();
  //   }
  // };
  handleBack = () => {
    const {headerTitle, tapNote, nav, items} = this.props;

    if (headerTitle === 'Cart') {
      nav.navigate('Home');
    } else if (headerTitle === 'Product List') {
      nav.navigate('Home');
    } else {
      console.log('Navigation Back');
      nav.goBack();
    }
  };

  handleCart = () => {
    const {tapNote, items} = this.props;
    console.log(items);
    if (items) {
      let item = items;
      this.props.nav.push('MyCart', {item, tapNote});
    } else {
      this.props.nav.push('MyCart', {tapNote});
    }
  };

  handleNotification = () => {
    this.props.nav.navigate('Notification');
  };

  render() {
    const {cartItemCount} = this.state;

    const {
      headerTitle,
      navAction,
      showCartIcon,
      showNotificationIcon,
      notificationCount,
    } = this.props;

    let handleNavAction = this.toggleDrawer;
    let navIcon = ic_home_white;

    if (navAction === 'back') {
      handleNavAction = this.handleBack;
      navIcon = ic_backarrow;
    }

    const showCartBadge = cartItemCount > 0;
    const isCartCountTwoDigit = cartItemCount < 100;

    const showNotificationBadge = notificationCount > 0;
    const isNotificationCountTwoDigit = notificationCount < 100;

    return (
      <View
        style={[
          styles.headerContainer,
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.justifyBetween,
        ]}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={handleNavAction}>
          <Image
            source={navIcon}
            resizeMode="cover"
            style={[styles.iconColumn, basicStyles.marginRight]}
          />
        </TouchableHighlight>

        <Text
          style={[
            basicStyles.text,
            basicStyles.flexOne,
            basicStyles.whiteColor,
          ]}>
          {headerTitle}
        </Text>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          {showNotificationIcon && (
            <TouchableOpacity
              // style={styles.notificationIcon1}
              onPress={this.handleNotification}
              underlayColor="transparent">
              <Image
                source={ic_notifications}
                resizeMode="cover"
                style={styles.iconColumn}
              />

              {showNotificationBadge && (
                <View style={styles.notificationBadgeContainer}>
                  {isNotificationCountTwoDigit ? (
                    <Text style={styles.notificationBadge}>
                      {notificationCount}
                    </Text>
                  ) : (
                    <Text style={styles.notificationBadge}>99+</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}

          {showCartIcon && (
            <TouchableOpacity
              style={styles.cartIcon}
              underlayColor="transparent"
              onPress={this.handleCart}>
              <Image
                source={ic_cart}
                resizeMode="cover"
                style={styles.iconColumn}
              />
              {showCartBadge && (
                <View style={styles.notificationBadgeContainer}>
                  {isCartCountTwoDigit ? (
                    <Text style={styles.notificationBadge}>
                      {cartItemCount}
                    </Text>
                  ) : (
                    <Text style={styles.notificationBadge}>99+</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#056393',
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: -5,
    backgroundColor: '#000',
    height: 14,
    width: 14,
    borderRadius: 7,
    textAlign: 'center',
    lineHeight: 14,
    color: '#fff',
    fontSize: wp(2.5),
  },
  notificationIconContainer: {
    marginLeft: wp(3),
  },
  notificationIcon: {
    width: wp(5.6),
    height: wp(5.6),
  },

  notificationBadgeContainer: {
    height: wp(3.7),
    width: wp(3.7),
    // paddingHorizontal: wp(1.3),
    backgroundColor: '#fff',
    borderRadius: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: wp(-1),
    right: wp(-1),
  },
  notificationBadge: {
    // flex: 1,
    color: '#333',
    fontSize: wp(2),
    textAlign: 'center',
  },
  iconSearch: {
    height: hp(2.8),
    aspectRatio: 1 / 1,
  },

  cartIcon: {
    paddingLeft: wp(2),
  },

  notificationIcon1: {
    marginRight: wp(-1),
  },
  iconColumn: {
    height: hp(2.8),
    aspectRatio: 1 / 1,
  },
});
