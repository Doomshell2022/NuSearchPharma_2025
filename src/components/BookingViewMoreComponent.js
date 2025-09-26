import React from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BookingViewMoreComponent = (props) => {
  const {item} = props;
  const {productName, quantity, gst, totalProductAmount, totalGst} = item;

  // console.log('hiiiiiii', item);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.section}>
        <View style={styles.sectionList}>
          <Text style={styles.item}>Product Name:</Text>
          <Text style={styles.item1}>{productName}</Text>
        </View>

        <View style={styles.sectionList}>
          <Text style={styles.item}>Product Quantity :</Text>
          <Text style={styles.item1}>{quantity}</Text>
        </View>

        <View style={styles.sectionList}>
          <Text style={styles.item}> Product Amount :</Text>
          <Text style={styles.item1}>₹ {totalProductAmount}</Text>
        </View>

        <View style={styles.sectionList}>
          <Text style={styles.item}>Product GST({totalGst}%):</Text>
          <Text style={styles.item1}>₹ {gst}</Text>
        </View>
      </View>
    </View>
  );
};

export default BookingViewMoreComponent;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginHorizontal: wp(1.5),
  },
  section: {
    margin: wp(1),
  },
  sectionList: {
    flexDirection: 'row',
    paddingVertical: wp(1),
  },
  item: {
    flex: 1,
    fontSize: wp(3),
    color: '#056393',
    fontWeight: '700',
  },
  item1: {
    flex: 1,
    fontSize: wp(3),
    //color: '#000',
    marginLeft: hp(-8),
  },
});
