import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableHighlight,
  Alert,
  RefreshControl,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import {showToast} from '../components/CustomToast';
import CustomLoader from '../components/CustomLoader';

// Icons

import ic_profileImage from '../assets/icons/ic_profileImage.png';
import ic_edit_profile from '../assets/icons/ic_edit_profile.png';
import ic_profile_user from '../assets/icons/ic_profile_user.png';
import ic_profile_phone from '../assets/icons/ic_profile_phone.png';
import ic_profile_mail from '../assets/icons/ic_profile_mail.png';
import ic_profile_logout from '../assets/icons/ic_profile_logout.png';
import ic_firmName from '../assets/icons/ic_firmName.png';
import ic_gst from '../assets/icons/ic_gst.png';
import ic_billingAddress1 from '../assets/icons/ic_billingAddress1.png';
import ic_state from '../assets/icons/ic_state.png';

// Styles
import basicStyles from '../styles/BasicStyles';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';

//UserPreference
import {clearData, KEYS, getData, storeData} from '../api/UserPreference';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: '',
      isListRefreshing: false,
      isLoading: true,
      notificationCount: 0,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.showUserProfile();
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

  showUserProfile = async () => {
    try {
      // starting loader
      // this.setState({isLoading: true});
      let params = null;
      // calling api
      const response = await makeRequest(
        BASE_URL + 'viewProfile',
        params,
        true,
        true,
      );
      console.log('response====', response);
      if (response) {
        const {success, isAuthTokenExpired} = response;

        if (success) {
          const {userProfile} = response;

          this.setState({
            userProfile,
            isLoading: false,
            isListRefreshing: false,
          });
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

  handleEditProfile = () => {
    // this.props.navigation.push('EditProfile');
    const {userProfile} = this.state;
    this.props.navigation.navigate('EditProfile', {
      userProfile,
      refreshCallback: this.showUserProfile,
    });
    console.log(userProfile);
  };

  onLogoutYesPress = async () => {
    try {
      // Clearing user preferences from local storage
      await clearData();
      Alert.alert('Info!', 'Logout Successfully', [{text: 'OK'}], {
        cancelable: false,
      });
      // Resetting Navigation to initial state for login again
      this.props.navigation.navigate('Login');
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure, you want to logout?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.onLogoutYesPress},
      ],
      {
        cancelable: false,
      },
    );
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {userProfile, notificationCount} = this.state;
    const {name, mobile, email, firmName, gstNumber, address, state, image} =
      userProfile;

    return (
      <SafeAreaView
        style={[styles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Profile"
          nav={this.props.navigation}
          // navAction="back"
          navA
        />
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.awareContainer}>
          <View
            refreshControl={
              <RefreshControl
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            }>
            <View style={styles.formContainer}>
              <View style={styles.profileHeader}>
                {image ? (
                  <Image
                    source={{uri: image}}
                    resizeMode="cover"
                    style={styles.userImage}
                  />
                ) : (
                  <Image
                    source={ic_profileImage}
                    resizeMode="cover"
                    style={styles.userImage}
                  />
                )}
              </View>
              <TouchableOpacity
                style={styles.listButton}
                onPress={this.handleEditProfile}>
                <Text style={styles.listButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <View style={styles.profileRow}>
                <Image
                  source={ic_profile_user}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <Text style={styles.userText}>{name}</Text>
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_profile_phone}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <Text style={styles.userText}>{mobile}</Text>
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_profile_mail}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <Text style={styles.userText}>{email}</Text>
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_firmName}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                {firmName ? (
                  <Text style={styles.userText}>{firmName}</Text>
                ) : (
                  <Text style={styles.userText}>Please Update Firm Name</Text>
                )}
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_gst}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                {gstNumber ? (
                  <Text style={styles.userText}>{gstNumber}</Text>
                ) : (
                  <Text style={styles.userText}>Please Update GST Number</Text>
                )}
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_billingAddress1}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                {address ? (
                  <Text style={styles.userText}>{address}</Text>
                ) : (
                  <Text style={styles.userText}>
                    Please Update Billing Address
                  </Text>
                )}
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_state}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                {state ? (
                  <Text style={styles.userText}>{state}</Text>
                ) : (
                  <Text style={styles.userText}>Please Update State</Text>
                )}
              </View>

              <TouchableHighlight
                style={styles.profileRow}
                onPress={this.handleLogout}
                underlayColor="transparent">
                <View style={styles.logoutRow}>
                  <Image
                    source={ic_profile_logout}
                    resizeMode="cover"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.userText}>Logout</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: wp(2),
    elevation: 10,
  },
  editIcon: {
    // alignSelf: 'flex-end',
    padding: wp(2),
  },
  editIconImage: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: hp(2),
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: wp(3.5),
    marginTop: hp(2),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#cccccc80',
    height: hp(6),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
    borderRadius: wp(5),
  },
  logoutRow: {
    flexDirection: 'row',
  },
  infoIcon: {
    width: wp(4.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  userText: {
    fontSize: wp(3.5),
  },

  nameText: {
    fontSize: wp(5),
    color: '#fff',
  },
  userImage: {
    height: hp(14),
    aspectRatio: 1 / 1,
    borderRadius: hp(7),

    marginTop: hp(-2),
  },
  listButton: {
    backgroundColor: '#056393',
    height: hp(4.5),

    paddingHorizontal: wp(6),
    borderRadius: 3,
    marginVertical: hp(1),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listButtonText: {
    color: '#fff',
    fontSize: wp(3),
  },
});
