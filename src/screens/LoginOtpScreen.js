import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  ImageBackground,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';

//Components
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {KEYS, storeData} from '../api/UserPreference';

// Firebase
// import {checkPermission} from '../firebase_api/FirebaseAPI';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import logo from '../assets/images/logo.png';
import logo_png from '../assets/images/logo_png.png';
import login_background from '../assets/images/login_background.jpg';

export default class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      mobile: '',
      showProcessingLoader: false,
    };
  }

  handleLogin = async () => {
    const {otp} = this.state;

    // validations
    if (otp.trim() === '') {
      Alert.alert('Alert!', 'Please enter OTP', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      const info = this.props.navigation.getParam('info', null);
      const {mobile} = info;

      // preparing params
      const params = {
        mobile,
        otp,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'loginOtpVerify',
        params,
        false,
        false,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          // persisting userInfo
          const {userInfo} = response;
          await storeData(KEYS.USER_INFO, userInfo);

          // stopping loader
          this.setState({showProcessingLoader: false});

          // await checkPermission();

          // navigating to home screen
          this.props.navigation.navigate('Home');
          showToast(message);
          /* Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          }); */
        } else {
          // stopping loader
          this.setState({showProcessingLoader: false});
          showToast(message);
          /* Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          }); */
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOtpChange = (otp) => {
    this.setState({otp});
  };

  handleResentOTP = async () => {
    const {mobile} = this.state;

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      const info = this.props.navigation.getParam('info', null);
      const {mobile} = info;

      // preparing params
      const params = {
        mobile,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'resendOtp',
        params,
        false,
        false,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          // stopping loader
          this.setState({showProcessingLoader: false});
          /* Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          }); */
          showToast(message);
        } else {
          // stopping loader
          this.setState({showProcessingLoader: false});

          /*    Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          }); */
          showToast(message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <ImageBackground
        source={login_background}
        resizeMode="cover"
        style={basicStyles.container}>
        <SafeAreaView
          style={[basicStyles.mainContainer, basicStyles.justifyCenter]}>
          <View style={styles.logContainer}>
            <Image
              source={logo_png}
              resizeMode="cover"
              style={basicStyles.logo}
            />
          </View>

          <View
            style={[
              basicStyles.flexOne,
              basicStyles.whiteBackgroundColor,
              styles.loginContainer,
            ]}>
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.awareContainer}>
              <View
                style={[
                  basicStyles.flexOne,
                  basicStyles.alignCenter,
                  basicStyles.formContainer,
                ]}>
                <Text style={styles.subTitle}>You will get a OTP via SMS</Text>
                <OTPInputView
                  style={styles.otpContainer}
                  pinCount={4}
                  autoFocusOnLoad
                  placeholderCharacter="0"
                  placeholderTextColor="#ACACAC"
                  codeInputFieldStyle={styles.underlineStyleBase}
                  onCodeChanged={this.handleOtpChange}
                />

                <TouchableHighlight
                  style={styles.otpButton}
                  underlayColor="#05639380"
                  onPress={this.handleLogin}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Login
                  </Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.resentOtpButton}
                  underlayColor="transparent"
                  onPress={this.handleResentOTP}>
                  <Text style={basicStyles.text}>Resend OTP?</Text>
                </TouchableHighlight>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
        {this.state.showProcessingLoader && <ProcessingLoader />}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  logContainer: {
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
  },
  subTitle: {
    paddingHorizontal: wp(0),
    fontSize: wp(3.5),
    color: '#333',
    textAlign: 'center',
    marginBottom: hp(5),
    marginTop: hp(10),
  },
  otpContainer: {
    width: wp(50),
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  underlineStyleBase: {
    color: '#333',
    backgroundColor: '#fff',
    width: 40,
    height: 40,
  },
  otpButton: {
    backgroundColor: '#056393',
    height: hp(5.5),
    borderRadius: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
    paddingHorizontal: wp(8),
  },
  resentOtpButton: {
    paddingHorizontal: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(3),
  },
  formContainer: {
    width: wp(100),
  },
});
