import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// styles
import basicStyles from '../styles/BasicStyles';

// Icons
import ic_confirmed from '../assets/icons/ic_confirmed.png';

export default class ThankyouScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleContinue = () => {
    this.props.navigation.navigate('Place');
  };

  render() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          basicStyles.alignCenter,
          basicStyles.justifyCenter,
        ]}>
        <Image
          source={ic_confirmed}
          resizeMode="cover"
          style={styles.confirmedIcon}
        />
        <Text style={styles.thankyou}>ThankYou</Text>

        <Text style={styles.thankyou1}>Your Order Booked Successfully</Text>

        {/* <Text style={styles.thankyou2}>
          Check My booking Section For Order details.
        </Text> */}

        <TouchableHighlight
          onPress={this.handleContinue}
          style={styles.continueButton}
          underlayColor="#0088cc">
          <Text style={[basicStyles.text, basicStyles.whiteColor]}>
            Continue
          </Text>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  confirmedIcon: {
    height: hp(8),
    aspectRatio: 1 / 1,
    marginBottom: hp(3),
  },
  continueButton: {
    backgroundColor: '#056393',
    paddingVertical: wp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(2),
    marginTop: hp(4),
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  thankyou: {
    fontSize: wp(8),
    //color: '#222',
    //fontWeight: '700',
  },
  thankyou1: {
    fontSize: wp(5),
  },
  thankyou2: {
    fontSize: wp(4),
  },
});
