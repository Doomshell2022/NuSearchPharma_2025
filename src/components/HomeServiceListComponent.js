import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

const HomeService = (props) => {
  const handleService = () => {
    props.nav.push('Product', {item});
  };
  const {item} = props;
  const {categoryId, name, image} = item;

  //console.log(image);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.serviceList]}
        underlayColor="transparent"
        onPress={handleService}>
        <View style={basicStyles.directionRow}>
          <Image
            source={{uri: image}}
            resizeMode="cover"
            style={styles.serviceImage}
          />
        </View>

        <View style={[styles.serviceTitle]}>
          <Text
            style={[
              styles.tileTitle,
              // basicStyles.flexOne,
              // basicStyles.whiteColor,
              basicStyles.textCenter,
            ]}>
            {name.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default HomeService;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    //flexDirection: 'row',
    borderRadius: wp(2),
    width: wp(47),
    justifyContent: 'center',
    padding: wp(1.5),
    // borderWidth: 0.8,
    margin: wp(1),
    borderColor: '#056393',
    backgroundColor: '#ffffff',
    marginBottom: hp(-0.5),
  },
  serviceList: {
    // elevation: 5,
    // alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: hp(5),
  },
  serviceImage: {
    height: hp(20),
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: wp(2),
    alignSelf: 'center',
    marginBottom: wp(1.5),
  },
  // serviceTitle: {
  //   backgroundColor: '#056393',
  //   // padding: wp(3),
  //   height: hp(5),
  //   borderRadius: hp(2.5),
  //   justifyContent: 'center',
  //   marginTop: hp(0.1),
  //   alignItems: 'center',
  // },

  tileTitle: {
    // fontSize: wp(3.8),
    color: '#056393',
    fontWeight: 'bold',
    marginBottom: hp(1),
  },

  moreIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
});
