import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import logo from '../assets/images/logo.png';
import logo_png from '../assets/images/logo_png.png';
import login_background from '../assets/images/login_background.jpg';

//Validations
import {isMobileNumber} from '../validations/FormValidator';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// Icons
import ic_mobile_black from '../assets/icons/ic_mobile_black.png';

//Component
import ProcessingLoader from '../components/ProcessingLoader';

import {showToast} from '../components/CustomToast';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      //showProcessingLoader: 'false',
    };
  }

  handleSignUp = () => {
    this.props.navigation.push('Signup');
  };
  handleOtp = async () => {
    const {mobile} = this.state;
    Keyboard.dismiss();

    // validations
    if (!isMobileNumber(mobile)) {
      Alert.alert(
        'Alert!',
        'Please enter valid mobile number!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // preparing params
      const params = {
        mobile,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'login',
        params,
        false,
        false,
      );

      if (response) {
        // stopping loader
        this.setState({
          showProcessingLoader: false,
        });

        const {success, message} = response;

        if (success) {
          this.props.navigation.push('LoginOtp', {
            info: {mobile},
          });
          showToast(message);
        } else {
          /*  Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          }); */
          showToast(message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMobileChange = (mobile) => {
    this.setState({mobile});
  };

  render() {
    return (
      <>
        <ImageBackground
          source={login_background}
          resizeMode="cover"
          style={basicStyles.container}>
          <SafeAreaView
            style={[
              basicStyles.mainContainer,
              basicStyles.alignCenter,
              basicStyles.justifyCenter,
            ]}>
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
                    basicStyles.alignCenter,
                    // basicStyles.justifyCenter,
                    // basicStyles.flexOne,
                    styles.formContainer,
                  ]}>
                  <Text style={styles.title}>Welcome to NuSearch</Text>
                  <Text style={styles.subTitle}>
                    We will send an SMS with a confirmation code to this number
                  </Text>

                  <View style={styles.inputContainer}>
                    <Image
                      source={ic_mobile_black}
                      resizeMode="cover"
                      style={basicStyles.iconRow}
                    />
                    <View style={styles.separator} />

                    <TextInput
                      placeholder="Enter Your Mobile Number"
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={10}
                      placeholderTextColor="#333"
                      value={this.state.mobile}
                      onChangeText={this.handleMobileChange}
                    />
                  </View>

                  <TouchableHighlight
                    style={styles.otpButton}
                    onPress={this.handleOtp}
                    underlayColor="#33333380">
                    <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                      Get OTP
                    </Text>
                  </TouchableHighlight>
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.marginTop,
                    ]}>
                    <Text>Don't have an Account? </Text>
                    <TouchableOpacity
                      style={styles.signUpButton}
                      onPress={this.handleSignUp}
                      underlayColor="#ffffff80">
                      <Text
                        style={[
                          basicStyles.heading,
                          basicStyles.themeTextColor,
                        ]}>
                        {'  '}
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </SafeAreaView>
          {this.state.showProcessingLoader && <ProcessingLoader />}
        </ImageBackground>
      </>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp(15),
  },

  title: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: '700',
    marginBottom: wp(2),
  },

  subTitle: {
    paddingHorizontal: wp(10),
    fontSize: wp(3.5),
    color: '#333',
    // marginTop: hp(10),
    textAlign: 'center',
    marginBottom: hp(5),
  },

  inputContainer: {
    maxWidth: 300,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: wp(3),
  },
  inputIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
  },
  countryCode: {
    fontSize: wp(3),
    height: hp(6),
    color: '#fff',
  },
  input: {
    fontSize: wp(3.2),
    flex: 1,
    height: hp(6),
    color: '#000',
  },
  formContainer: {
    // width: wp(100),
    // borderWidth: 1,
  },

  separator: {
    width: 1,
    height: hp(5),
    backgroundColor: '#ccc',
    marginHorizontal: wp(2),
  },

  otpButton: {
    backgroundColor: '#056393',
    height: hp(5.5),
    borderRadius: hp(2.75),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
    paddingHorizontal: wp(10),
  },

  signUpButtonView: {
    width: wp(100),
  },

  signUpText: {
    color: '#333',
  },
  signUpPress: {
    color: '#056393',
    paddingLeft: wp(1),
    fontWeight: '700',
  },
  signUpButton: {
    // marginTop: hp(1.5),
  },
});
