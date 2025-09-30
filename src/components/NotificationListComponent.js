import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_notification_bell from '../assets/icons/ic_notification_bell.png';
import bell from '../assets/icons/bell.png';

const NotificationList = (props) => {
  // preparing Info
  const {item} = props;

  const {title, message, date} = item;

  return (
    <View style={styles.listContainer}>
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Image
            source={ic_notification_bell}
            resizeMode="cover"
            style={styles.bellIcon}
          />
        </View>

        <View style={styles.dateTitle}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{message}</Text>
        </View>
      </View>

      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  listContainer: {
    padding: wp(2),
    backgroundColor: '#fff',
    borderRadius: wp(1),
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 1,
    paddingVertical: hp(2),
  },
  dateTitle: {
    flex: 1,
    paddingLeft: wp(2),
  },
  title: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#333',
    marginBottom: hp(0.3),
  },
  date: {
    fontSize: wp(3),
    paddingTop: wp(2),
  },
  iconContainer: {
    backgroundColor: '#f2f2f2',
    height: hp(5),
    width: hp(5),
    borderRadius: hp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
    // marginBottom: hp(2),
  },
  openIconBackground: {
    height: hp(7),
    width: hp(7),
    borderRadius: hp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f1f1',
  },
  openIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  description: {
    paddingTop: wp(0.3),
    fontSize: wp(3),
  },
});
