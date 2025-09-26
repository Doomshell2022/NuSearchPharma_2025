import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Styles
import basicStyles from '../styles/BasicStyles';

// Components
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';

// Images
import logo from '../assets/images/logo.png';

// Icons
import ic_share_blue from '../assets/icons/ic_share_blue.png';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData, storeData, clearData} from '../api/UserPreference';

import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

export default class InviteFriendScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      referralInfo: null,
      isLoading: true,

      notificationCount: 0,
    };
  }

  componentDidMount() {
    this.fetchReferralInfo();
    this.fetchNotificationCount();
  }

  fetchReferralInfo = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      let params = null;

      // calling api
      const response = await makeRequest(
        BASE_URL + 'inviteFriend',
        params,
        true,
        true,
      );
      console.log('+++++++++', response);
      if (response) {
        const {success, isAuthTokenExpired} = response;

        if (success) {
          const {output: referralInfo} = response;
          this.setState({referralInfo, isLoading: false});
        } else {
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

  handleShare = async () => {
    try {
      const {referralInfo} = this.state;
      const {shareInfo, referralCode, referralAmount} = referralInfo;
      const {title, message, androidUrl, iosUrl, image} = shareInfo;
      const {url: url, extension} = image;

      const base64ImageData = await this.encodeImageToBase64(url);

      if (!base64ImageData) {
        return;
      }

      const shareOptions = {
        title,
        subject: title,
        message: `${title}\n${message}\n${'Android'}\n${androidUrl}\n${'iOS'}\n${iosUrl}`,
        url: `data:image/${extension};base64,${base64ImageData}`,
      };
      console.log('PPPPP', shareOptions);

      // stopping loader
      this.setState({showProcessingLoader: false});

      await Share.open(shareOptions);
      console.log('JJJJJ', await Share.open(shareOptions));
    } catch (error) {
      console.log(error.message);
    }
  };

  encodeImageToBase64 = async (url) => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});

      const downloadedImage = await rnFetchBlob.fetch('GET', url);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  fetchNotificationCount = async () => {
    try {
      let params = null;

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getNotificationCount',
        params,
        true,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {notificationCount} = response;

          await storeData(KEYS.NOTIFICATION_COUNT, {notificationCount});
          this.setState({
            notificationCount,
            isLoading: false,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    const {isLoading, notificationCount} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    const {referralInfo} = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <HeaderComponent
          headerTitle="Invite Friend"
          nav={this.props.navigation}
          // navAction="back"
        />
        <View
          style={[
            basicStyles.mainContainer,
            basicStyles.padding,
            basicStyles.justifyCenter,
            basicStyles.alignCenter,
          ]}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />

          <Text style={[styles.heading]}>Missing Friends?</Text>
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.inviteText}>
                Invite friends to download app and avail exciting offers on all
                products.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={this.handleShare}
            underlayColor="transparent">
            <View style={[basicStyles.directionRow, styles.otpButton]}>
              <Image
                source={ic_share_blue}
                resizeMode="contain"
                style={styles.shareIcon}
              />
              <Text style={styles.buttonText}>Invite Now</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  smile: {
    height: hp(10),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    marginBottom: hp(3),
  },
  logo: {
    height: hp(12),
    aspectRatio: 3 / 2,
    alignSelf: 'center',
    marginBottom: hp(3),
  },
  contentContainer: {
    marginTop: hp(2),
    width: wp(94),
    height: hp(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(3),
  },
  walletContainer: {
    marginTop: hp(3.5),
    width: wp(100),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(3.5),
    borderWidth: 8,
    borderColor: '#0082c7',
  },
  walletIcon: {
    width: hp(6),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    margin: wp(2),
  },
  referralStyle: {
    alignItems: 'center',
    marginTop: hp(1.5),
  },

  inviteText: {
    textAlign: 'center',
    marginHorizontal: hp(1),
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#666',
  },
  docText: {
    fontSize: wp(4),
    fontWeight: '700',
    paddingTop: hp(1),
    color: '#0082c7',
    textAlign: 'center',
  },
  otpButton: {
    alignSelf: 'center',
    marginTop: hp(5),
    backgroundColor: '#fff',
    height: hp(6),
    paddingHorizontal: wp(8),
    borderRadius: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },

  offerTxt: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#0082c7',
  },
  descText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#555',
  },
  offerContainer: {
    height: hp(6),
    width: wp(35),
    marginTop: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#0082c7',
    borderRadius: wp(2),
  },
  shareIcon: {
    width: hp(2.8),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#333',
  },
  heading: {
    color: '#333',
    fontSize: wp(5.5),
    textAlign: 'center',
    fontWeight: '700',
    marginTop: wp(2),
  },
});
