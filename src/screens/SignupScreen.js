import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  ImageBackground,
  Alert,
  TouchableOpacity,
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

// Icons
import ic_mobile_black from '../assets/icons/ic_mobile_black.png';
import ic_profile_user from '../assets/icons/ic_profile_user.png';
import ic_profile_mail from '../assets/icons/ic_profile_mail.png';

//Components
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';

//Validation
import {isMobileNumber, isEmailAddress} from '../validations/FormValidator';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      mobile: '',
      showProcessingLoader: false,
    };
  }

  handleOtp = async () => {
    try {
      const {name, email, mobile} = this.state;

      // validations
      if (name.trim() === '') {
        Alert.alert('Alert!', 'Please enter your name!', [{text: 'OK'}], {
          cancelable: false,
        });
        this.setState({name: ''});
        return;
      }

      if (!isMobileNumber(mobile)) {
        Alert.alert('Alert!', 'Please enter valid mobile number!', [
          {text: 'OK'},
        ]);
        return;
      }

      if (!isEmailAddress(email)) {
        Alert.alert('Alert!', 'Please enter valid email address!', [
          {text: 'OK'},
        ]);
        return;
      }

      // starting loader
      this.setState({showProcessingLoader: true});

      // preparing request params
      const params = {
        name,
        email,
        mobile,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'userRegistration',
        params,
        false,
        false,
      );

      // stopping loader
      this.setState({
        showProcessingLoader: false,
      });

      if (response) {
        const {success, message} = response;
        if (success) {
          this.props.navigation.push('Otp', {info: {mobile}});
          showToast(message);
          /* Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          }); */
        } else {
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

  handleName = (changedText) => {
    this.setState({name: changedText});
  };

  handleEmail = (changedText) => {
    this.setState({email: changedText});
  };

  handlePhoneNumber = (changedText) => {
    this.setState({mobile: changedText});
  };

  handleSignUp = () => {
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
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
                  basicStyles.flexOne,
                  basicStyles.alignCenter,
                  styles.formContainer,
                ]}>
                <Text style={styles.subTitle}>Register Now</Text>

                <View style={styles.inputContainer}>
                  <Image
                    source={ic_profile_user}
                    resizeMode="cover"
                    style={basicStyles.iconRow}
                  />
                  <View style={styles.separator} />

                  <TextInput
                    placeholder="Name"
                    style={styles.input}
                    placeholderTextColor="#666"
                    value={this.state.name}
                    onChangeText={this.handleName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Image
                    source={ic_mobile_black}
                    resizeMode="cover"
                    style={basicStyles.iconRow}
                  />
                  <View style={styles.separator} />

                  <TextInput
                    placeholder="Mobile Number"
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={10}
                    placeholderTextColor="#666"
                    value={this.state.mobile}
                    onChangeText={this.handlePhoneNumber}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Image
                    source={ic_profile_mail}
                    resizeMode="cover"
                    style={basicStyles.iconRow}
                  />
                  <View style={styles.separator} />

                  <TextInput
                    placeholder="Email ID"
                    style={styles.input}
                    placeholderTextColor="#666"
                    value={this.state.email}
                    onChangeText={this.handleEmail}
                  />
                </View>

                <TouchableHighlight
                  style={styles.otpButton}
                  onPress={this.handleOtp}
                  underlayColor="#ffffff80">
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Sign Up
                  </Text>
                </TouchableHighlight>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.marginTop,
                  ]}>
                  <Text>Already Register?</Text>
                  <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={this.handleSignUp}
                    underlayColor="#ffffff80">
                    <Text
                      style={[basicStyles.heading, basicStyles.themeTextColor]}>
                      {'  '}
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
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
    alignItems: 'center',
    width: wp(100),
  },
  subTitle: {
    paddingHorizontal: wp(15),
    fontSize: wp(4),
    color: '#333',
    fontWeight: '700',
    marginTop: hp(6),
    textAlign: 'center',
    marginBottom: hp(5),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: wp(3),
    marginBottom: hp(3),
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
    height: hp(5.5),
    color: '#000',
  },

  separator: {
    width: 1,
    height: hp(4.5),
    backgroundColor: '#ccc',
    marginHorizontal: wp(2),
  },

  otpButton: {
    backgroundColor: '#056393',
    height: hp(5.5),
    borderRadius: hp(2.75),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    paddingHorizontal: wp(10),
  },
  formContainer: {
    width: wp(90),
  },

  signUpButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: hp(13),
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
