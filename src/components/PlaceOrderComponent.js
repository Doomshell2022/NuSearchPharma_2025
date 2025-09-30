import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_pdf from '../assets/icons/ic_pdf.png';
import ic_appointment from '../assets/icons/ic_appointment.png';

import basicStyles from '../styles/BasicStyles';

const PlaceOrderComponent = (props) => {
  const {item} = props;
  const {
    quantity,
    orderId,
    orderDate,
    totalAmount,
    totalGstAmount,
    totalWeight,
    totalFreight,
    status,
    product,
    totalGst,
  } = item;
  console.log('product321', item);
  const handleViewMore = () => {
    // const {product} = props.item;
    console.log('product', product);
    props.nav.push('BookingViewMore', {
      product,
    });
  };

  const handleOpenPdf = () => {
    // console.log('hiiiiiiiiiiiiiiiiinvoicw');
    const {invoice} = item;

    if (invoice) {
      Linking.openURL(invoice).catch((err) =>
        console.error('An error occurred', err),
      );
    } else {
      Alert.alert('Order Invoice', 'No Invoice Generated');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.textIdStyle]}>
        <View style={[basicStyles.directionRow]}>
          <Text style={styles.itemId}>Id :</Text>
          <Text style={[styles.itemIdText]}># {orderId}</Text>
        </View>

        <View style={basicStyles.directionRow}>
          <Image
            source={ic_appointment}
            resizeMode="cover"
            style={styles.dateIcon}
          />
          <Text style={styles.itemIdText}>{orderDate}</Text>
        </View>
      </View>

      <View style={[basicStyles.marginBottom]}>
        <Text style={styles.orderView}>Order Detail</Text>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            // basicStyles.flexOne,
            styles.listSpace,
          ]}>
          <Text style={styles.titleText}>Status :</Text>
          <Text style={styles.item}>{status}</Text>
          <Text style={styles.titleText}>Quantity :</Text>
          <Text style={styles.item}>{quantity}</Text>
        </View>

        {/* <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            // basicStyles.flexOne,
            styles.listSpace,
          ]}>
          <Text style={styles.titleText}>Total Weight :</Text>
          <Text style={styles.item}>{totalWeight}</Text>
          <Text style={styles.titleText}>Total Freight :</Text>
          <Text style={styles.item}>₹ {totalFreight}</Text>
        </View> */}

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            // basicStyles.flexOne,
            styles.listSpace,
          ]}>
          <Text style={styles.titleText}>Total GST :</Text>
          <Text style={styles.item}>₹ {totalGstAmount}</Text>
          <Text style={styles.titleText}>Total Amount :</Text>
          <Text style={styles.item}>₹ {totalAmount}</Text>
        </View>

        <TouchableOpacity style={styles.item4} onPress={handleOpenPdf}>
          <Image source={ic_pdf} resizeMode="cover" style={styles.iconColumn} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.listButton} onPress={handleViewMore}>
        <Text style={styles.listButtonText}>View More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlaceOrderComponent;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    padding: wp(2),
    borderRadius: 4,
    // borderWidth: wp(0.2),
    // borderColor: '#999',
  },
  title: {
    color: '#000',
    fontWeight: '700',
    fontSize: wp(3),
  },
  textIdStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  sectionList: {
    flexDirection: 'row',
    paddingVertical: wp(1),
  },

  itemId: {
    fontSize: wp(3),
    color: '#000',
    textAlign: 'left',
    marginRight: wp(2),
    fontWeight: '700',
  },

  itemIdText: {
    fontSize: wp(3),
    color: '#000',
    textAlign: 'right',
    fontWeight: '700',
  },
  titleText: {
    flex: 1,
    fontSize: wp(3),
    color: '#000',
    fontWeight: '700',
  },
  item: {
    flex: 1,
    fontSize: wp(3),
    color: '#000',
  },
  // itemAmount: {
  //   flex: 1,
  //   fontSize: wp(3),
  //   color: '#000',
  //   fontWeight: '700',
  // },
  item4: {
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: hp(-4.5),
  },
  listInfo: {
    fontSize: wp(3),
    color: '#000',
  },

  listButton: {
    backgroundColor: '#056393',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: 4,
    // marginVertical: hp(1),
    alignSelf: 'flex-start',
  },
  listButtonText: {
    color: '#fff',
    fontSize: wp(3),
  },
  orderView: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#056393',
    marginBottom: hp(0.5),
  },
  orderView1: {
    //lexDirection: 'row',
    flex: 1,
  },
  iconColumn: {
    height: hp(3.8),
    aspectRatio: 1 / 1,
  },
  dateIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  listSpace: {
    marginBottom: wp(1.5),
  },
});
