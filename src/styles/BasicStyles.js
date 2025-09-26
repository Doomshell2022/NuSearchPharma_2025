import {StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const basicStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    height: hp(12),
    aspectRatio: 3 / 2,
  },

  mainContainer: {
    flex: 1,
  },

  themeTextColor: {
    color: '#056393',
  },

  themeBackgroundColor: {
    backgroundColor: '#056393',
  },

  whiteColor: {
    color: '#fff',
  },

  whiteBackgroundColor: {
    backgroundColor: '#fff',
  },

  lightBackgroundColor: {
    backgroundColor: '#f2f1f1',
  },

  blackColor: {
    color: '#333',
  },

  flexOne: {
    flex: 1,
  },

  flexTow: {
    flex: 2,
  },

  flexThree: {
    flex: 3,
  },

  padding: {
    padding: wp(2),
  },

  paddingHorizontal: {
    paddingHorizontal: wp(2),
  },

  paddingVentricle: {
    paddingVertical: wp(2),
  },

  paddingBottom: {
    paddingBottom: wp(2),
  },

  paddingTop: {
    paddingTop: wp(2),
  },

  paddingLeft: {
    paddingLeft: wp(2),
  },

  paddingRight: {
    paddingRight: wp(2),
  },
  margin: {
    margin: wp(2),
  },

  marginHorizontal: {
    marginHorizontal: wp(2),
  },

  marginVentricle: {
    marginVertical: wp(2),
  },

  marginBottom: {
    marginBottom: wp(2),
  },

  marginTop: {
    marginTop: wp(2),
  },

  marginLeft: {
    marginLeft: wp(2),
  },

  marginRight: {
    marginRight: wp(2),
  },

  directionRow: {
    flexDirection: 'row',
  },

  directionColumn: {
    flexDirection: 'column',
  },

  justifyBetween: {
    justifyContent: 'space-between',
  },

  justifyAround: {
    justifyContent: 'space-around',
  },

  justifyEvenly: {
    justifyContent: 'space-evenly',
  },

  justifyEnd: {
    justifyContent: 'flex-end',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  alignCenter: {
    alignItems: 'center',
  },

  alignEnd: {
    alignItems: 'flex-end',
  },

  text: {
    fontSize: wp(3.2),
    color: '#222',
  },

  textCenter: {
    textAlign: 'center',
  },

  heading: {
    fontSize: wp(3.1),
    fontWeight: '700',
    color: '#222',
  },

  textBold: {
    fontWeight: '700',
  },

  iconRow: {
    width: hp(2.5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },

  iconColumn: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  input: {
    color: '#fff',
    height: hp(6),
    flex: 1,
    borderRadius: 4,
    fontSize: wp(3.5),
    lineHeight: 12,
  },
  separatorVertical: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: wp(2),
    height: '100%',
  },
  separatorHorizontal: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(2),
    width: '100%',
  },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    // backgroundColor: '#fff',
    borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textAlign: 'center',
    width: wp(70),
    alignSelf: 'center',
  },
});

export default basicStyles;
