import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TextInput,
  TouchableHighlight,
  Platform,
  Keyboard,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PickerModal from 'react-native-picker-modal-view';
import {TouchableOpacity, State} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

// Components
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import ProcessingLoader from '../components/ProcessingLoader';

// Images

import ic_profileImage from '../assets/icons/ic_profileImage.png';
import ic_profile_user from '../assets/icons/ic_profile_user.png';
import ic_profile_phone from '../assets/icons/ic_profile_phone.png';
import ic_profile_mail from '../assets/icons/ic_profile_mail.png';
import ic_firmName from '../assets/icons/ic_firmName.png';
import ic_gst from '../assets/icons/ic_gst.png';
import ic_billingAddress1 from '../assets/icons/ic_billingAddress1.png';
import ic_state from '../assets/icons/ic_state.png';

// Styles
import basicStyles from '../styles/BasicStyles';

//Validation
import {isMobileNumber, isEmailAddress} from '../validations/FormValidator';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {getData, KEYS, clearData, storeData} from '../api/UserPreference';
import {showToast} from '../components/CustomToast';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    const userProfile = this.props.navigation.getParam('userProfile', null);
    const {
      name,
      mobile,
      email,
      firmName,
      gstNumber,
      address,
      stateId: stateNameId,
      state: stateName,
      image,
    } = userProfile;

    this.state = {
      showProcessingLoader: false,

      name,
      mobile,
      email,
      userImage: image,
      userPic: '',
      firmName,
      gstNumber,
      address,
      stateNameId,
      stateName,
      typeStates: [],
      notificationCount: 0,
      selectedStatesType: {
        Id: -1,
        Name: 'Select State',
        Value: 'Select State',
      },
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchStates();
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = async () => {
    try {
      this.props.navigation.pop();
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchStates = async () => {
    try {
      let params = null;
      // calling api
      const response = await makeRequest(
        BASE_URL + 'state',
        params,
        true,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {state} = response;

          const typeStates = state.map((item) => ({
            Id: item.id,
            Name: item.name,
            Value: item.name,
          }));

          this.setState({typeStates});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderStatePicker = (disabled, selected, showModal) => {
    const {selectedStatesType, stateName} = this.state;
    const {Value, Name} = selectedStatesType;

    const labelStyle = {
      color: '#000',
    };

    if (Name === 'Select State') {
      labelStyle.color = '#555';
    }
    const handlePress = disabled ? null : showModal;

    return (
      <View style={styles.profileRow}>
        <Image
          source={ic_state}
          resizeMode="contain"
          style={styles.infoIcon1}
        />
        <TouchableOpacity onPress={handlePress}>
          {Name === 'Select State' ? (
            <View>
              {stateName !== null ? (
                <Text style={styles.textInput}>{stateName}</Text>
              ) : (
                <Text style={styles.textInput}>{Name}</Text>
              )}
            </View>
          ) : (
            <Text style={styles.textInput}>{Name}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  handleSelectedState = (selectedStatesType) => {
    this.setState({selectedStatesType});
    return selectedStatesType;
  };

  handleSelectedStatesClose = () => {
    const {selectedStatesType} = this.state;
    this.setState({selectedStatesType});
  };

  onUpdateName = (name) => {
    this.setState({name});
  };
  onUpdateMobile = (mobile) => {
    this.setState({mobile});
  };

  onUpdateEmail = (email) => {
    this.setState({email});
  };

  onUpdateImage = (image) => {
    this.setState({
      image,
    });
  };

  onUpdateFirmName = (firmName) => {
    this.setState({firmName});
  };

  onUpdateGstNumber = (gstNumber) => {
    this.setState({gstNumber});
  };

  onUpdateBillingAddress = (address) => {
    this.setState({address});
  };

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          // 'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Storage" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };

  //image picker
  handleImagePick = async () => {
    try {
      ImagePicker.showImagePicker(
        {
          noData: true,
          mediaType: 'photo',
        },
        (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            if (Platform.OS === 'android') {
              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: response.fileName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              this.setState({
                userPic: imageData,
                userImage: response.uri,
                userImageName: response.fileName,
              });
            } else if (Platform.OS === 'ios') {
              let imgName = response.name;

              if (typeof fileName === 'undefined') {
                const {uri} = response;
                // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
                var getFilename = uri.split('/');
                imgName = getFilename[getFilename.length - 1];
              }

              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: imgName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              this.setState({
                userPic: imageData,
                userImage: response.uri,
                userImageName: imgName,
              });
            }
          }
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  handleUpdateProfile = async () => {
    Keyboard.dismiss();
    let {
      name,
      email,
      mobile,
      userPic,
      firmName,
      address,
      gstNumber,
      selectedStatesType,
      stateNameId,
      stateName,

      showProcessingLoader,
    } = this.state;

    if (firmName === null) {
      firmName = '';
    }
    if (gstNumber === null) {
      gstNumber = '';
    }
    if (address === null) {
      address = '';
    }

    try {
      // validations
      if (name.trim() === '') {
        Alert.alert('Alert!', 'Please enter Name', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      if (firmName.trim() === '') {
        Alert.alert('Alert!', 'Please enter Firm Name', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      /*   if (gstNumber.trim() === '') {
        Alert.alert('Alert!', 'Please enter GST Number', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      } */

      if (address.trim() === '') {
        Alert.alert('Alert!', 'Please enter Billing Address', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      if (stateName === null && selectedStatesType.Id === -1) {
        Alert.alert('Alert!', 'Please Select State', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      if (!isEmailAddress(email)) {
        Alert.alert('Alert!', 'Please enter valid Email Address', [
          {text: 'OK'},
        ]);
        return;
      }
      if (!isMobileNumber(mobile)) {
        Alert.alert('Alert!', 'Please enter valid Mobile Number', [
          {text: 'OK'},
        ]);
        return;
      }

      this.setState({showProcessingLoader: true});

      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {id: userId} = userInfo;

        const params = {
          userId,
          name: name,
          mobile: mobile,
          email: email,
          image: userPic,
          firmName: firmName,
          address: address,
          gstNumber: gstNumber,
          stateId:
            selectedStatesType.Id !== -1 ? selectedStatesType.Id : stateNameId,
        };

        const response = await makeRequest(
          BASE_URL + 'editProfile',
          params,
          true,
          false,
        );

        if (response) {
          const {success, message, isAuthTokenExpired} = response;
          if (success) {
            const {pop, getParam} = this.props.navigation;

            const refreshCallback = await getParam('refreshCallback', null);

            pop();

            await refreshCallback(message);

            this.setState({showProcessingLoader: false});
            // showToast(message);
            // Alert.alert('Info!', message, [{text: 'OK'}], {
            //   cancelable: false,
            // });
            showToast(message);
          } else {
            this.setState({showProcessingLoader: false});
            Alert.alert('Alert!', message, [{text: 'OK'}], {
              cancelable: false,
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
      }
    } catch (error) {
      Alert.alert(error.message);
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

  render() {
    const {showProcessingLoader, notificationCount} = this.state;
    const {
      id,
      name,
      mobile,
      email,
      userImage,
      firmName,
      address,
      gstNumber,
      typeStates,
      stateId,
      selectedStatesType,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="Edit Profile"
          showGradient
          nav={this.props.navigation}
        />
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.awareContainer}>
          <View style={styles.profileContainer}>
            {/* <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.profileContainer}> */}
            <View style={styles.formContainer}>
              {/* <KeyboardAvoidingView behavior="padding"> */}
              <View style={styles.profileHeader}>
                <TouchableHighlight
                  style={styles.nameFirstWord}
                  onPress={this.checkPermission}
                  underlayColor="transparent">
                  {userImage ? (
                    <Image
                      source={{uri: userImage}}
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
                </TouchableHighlight>
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_profile_user}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Your Name"
                  onChangeText={this.onUpdateName}
                  value={name}
                />
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_profile_phone}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="Enter Mobile Number"
                  onChangeText={this.onUpdateMobile}
                  value={mobile}
                />
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_profile_mail}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Email Address"
                  onChangeText={this.onUpdateEmail}
                  value={email}
                />
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_firmName}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Firm Name"
                  onChangeText={this.onUpdateFirmName}
                  value={firmName}
                />
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_gst}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter GST Number"
                  maxLength={15}
                  keyboardType="default"
                  onChangeText={this.onUpdateGstNumber}
                  value={gstNumber}
                />
              </View>

              <View style={styles.profileRow}>
                <Image
                  source={ic_billingAddress1}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.addressInput]}
                  placeholder="Enter Billing Address"
                  onChangeText={this.onUpdateBillingAddress}
                  value={address}
                  multiline={true}
                />
              </View>

              <View>
                <PickerModal
                  items={typeStates}
                  selected={selectedStatesType}
                  onSelected={this.handleSelectedState}
                  onClosed={this.handleSelectedStatesClose}
                  backButtonDisabled
                  showToTopButton={true}
                  showAlphabeticalIndex={false}
                  autoGenerateAlphabeticalIndex={true}
                  searchPlaceholderText="Search"
                  renderSelectView={this.renderStatePicker}
                />
              </View>

              <TouchableHighlight
                style={styles.saveButtonContainer}
                onPress={this.handleUpdateProfile}
                underlayColor="#1a1a1a">
                <Text style={styles.saveButtonText}>Update</Text>
              </TouchableHighlight>
              {/* </KeyboardAvoidingView> */}
            </View>
            {/* </ScrollView> */}
          </View>
        </KeyboardAwareScrollView>

        <FooterComponent nav={this.props.navigation} />
        {showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // profileContainer: {
  //   flex: 1,
  // },
  formContainer: {
    flex: 1,
    padding: wp(2),
    paddingTop: hp(5),
  },
  editIcon: {
    alignSelf: 'flex-end',
    padding: wp(2),
  },
  editIconImage: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: wp(3.5),
    marginTop: hp(2.5),
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
  infoIcon1: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  infoIcon2: {
    width: wp(5),
    aspectRatio: 1 / 1,

    marginLeft: hp(35),
  },
  userText: {
    fontSize: wp(3.5),
    borderRadius: wp(6),
  },
  saveButtonContainer: {
    height: hp(5),
    paddingHorizontal: wp(12),
    backgroundColor: '#056393',
    borderRadius: hp(2.5),
    justifyContent: 'center',
    marginBottom: hp(1.5),
    marginTop: hp(2.5),
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '900',
    textAlign: 'center',
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
  background: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f1f1',
    height: hp(7),
    paddingHorizontal: wp(3),
    marginTop: hp(2.5),
    borderRadius: wp(5),
  },

  addressInput: {
    paddingRight: wp(6),
  },
});
