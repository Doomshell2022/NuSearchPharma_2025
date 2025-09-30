import React, {Component, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icon
import ic_home_white from '../assets/icons/ic_home_white.png';

import smile from '../assets/icons/smile.png';
import ic_share from '../assets/icons/ic_share.png';
import ic_order from '../assets/icons/ic_order.png';

export default class FooterComponent extends Component {
  constructor(props) {
    super(props);
  }
  handelHome = () => {
    this.props.nav.navigate('Home');
  };

  handleProfile = async () => {
    this.props.nav.navigate('Profile');
  };

  handelShare = async () => {
    this.props.nav.navigate('Refer');
  };

  handelBooking = async () => {
    this.props.nav.navigate('Place');
  };

  render() {
    return (
      <View style={styles.footerContainer}>
        <TouchableHighlight
          style={styles.footerBottom}
          onPress={this.handelHome}
          underlayColor="#0088cc">
          <View style={styles.footerBottomContainer}>
            <Image source={ic_home_white} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>Home</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.footerBottom}
          onPress={this.handelBooking}
          underlayColor="#0088cc">
          <View style={styles.footerBottomContainer}>
            <Image source={ic_order} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>My Booking</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.footerBottom}
          onPress={this.handleProfile}
          underlayColor="#0088cc">
          <View style={styles.footerBottomContainer}>
            <Image source={smile} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>Profile</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.footerBottom}
          onPress={this.handelShare}
          underlayColor="#0088cc">
          <View style={styles.footerBottomContainer}>
            <Image source={ic_share} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>Share </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

// export default FooterComponent;

const styles = StyleSheet.create({
  footerContainer: {
    height: hp(7.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#056393',
  },
  footerBottom: {
    flex: 1,
  },
  footerBottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerMenuIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  menuTitle: {
    fontSize: wp(3),
    color: '#ffffff',
  },
});
