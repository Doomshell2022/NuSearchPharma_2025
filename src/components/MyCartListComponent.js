import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../styles/BasicStyles';

// Icons
import ic_delete from '../assets/icons/ic_delete_white.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {showToast} from './CustomToast';

export default class MyCartListComponent extends Component {
  constructor(props) {
    super(props);
    const {item} = this.props;

    const {
      id,
      productName,
      netPrice,
      mrp,
      quantity,
      gstPrice,
      totalGst,
      productTotalAmount,
    } = item;

    this.state = {
      productId: id,
      productName,
      netPrice,
      mrp,
      quantity,
      gstPrice,
      totalGst,
      productTotalAmount,
    };
  }

  handleAddition = async () => {
    const {quantity: qty} = this.state;
    const {handleAddToCart, item} = this.props;
    const updatedQuantity = qty + 1;
    this.setState({quantity: updatedQuantity});
    await handleAddToCart(item.id, updatedQuantity);
  };

  handleSubtraction = async () => {
    const {quantity: qty} = this.state;
    const {handleAddToCart, item} = this.props;
    if (qty > 1) {
      const updatedQuantity = qty - 1;
      this.setState({quantity: updatedQuantity});
      await handleAddToCart(item.id, updatedQuantity);
    }
  };

  handleDelete = () => {
    Alert.alert(
      'Remove',
      'Confirm Item Removal?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.handleRemoveCartItem},
      ],
      {
        cancelable: false,
      },
    );
  };

  handleRemoveCartItem = async () => {
    try {
      const {productId} = this.state;
      const {handleRemoveItem} = this.props;
      await handleRemoveItem(productId);
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {
      productName,
      netPrice,
      mrp,
      quantity,
      gstPrice,
      totalGst,
      productTotalAmount,
    } = this.state;

    const totalAmount = netPrice * quantity;

    return (
      <View style={styles.listContainer}>
        <View style={[styles.description, basicStyles.flexOne]}>
          <View style={styles.units1}>
            <Text style={[basicStyles.heading, basicStyles.themeTextColor]}>
              {productName}
            </Text>

            <TouchableHighlight
              onPress={this.handleDelete}
              underlayColor="transparent"
              style={styles.deleteButton}>
              <Image
                source={ic_delete}
                resizeMode="cover"
                style={styles.deleteIcon}
              />
            </TouchableHighlight>
          </View>

          <View style={styles.viewService}>
            <View style={styles.serviceView}>
              <Text style={styles.textServices}>Quantity:</Text>
              <View style={styles.units}>
                <TouchableOpacity
                  onPress={this.handleSubtraction}
                  style={{marginTop: wp(0.5)}}>
                  <Text style={{fontSize: wp(6)}}>-</Text>
                </TouchableOpacity>
                <TextInput
                  placeholder="Qty"
                  placeholderTextColor={'#555'}
                  keyboardType="numeric"
                  value={quantity.toString()}
                  maxLength={5}
                  style={[styles.inputContainer, {color: '#000000'}]}
                  onChangeText={this.handleQuantityChange}
                  editable={false}
                />

                <TouchableOpacity
                  onPress={this.handleAddition}
                  style={{marginTop: wp(0.5)}}>
                  <Text style={{fontSize: wp(5)}}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.serviceView}>
              <Text style={styles.textServices}>M.R.P.:</Text>
              <Text style={styles.textServices1}>₹ {mrp}</Text>
            </View>

            <View style={styles.serviceView}>
              <Text style={styles.textServices}>Net Rate:</Text>
              <Text style={styles.textServices1}>₹ {netPrice}</Text>
            </View>

            <View style={styles.serviceView}>
              <Text style={styles.textServices}>GST Amount({totalGst}%):</Text>
              <Text style={styles.textServices1}>₹ {gstPrice}</Text>
            </View>

            <View style={styles.serviceView}>
              <Text style={styles.textServices}>Total Product Amount:</Text>
              <Text style={styles.textServices1}>₹ {totalAmount}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: wp(2),
    alignItems: 'center',
    borderRadius: wp(2),
  },
  listImage: {
    width: wp(20),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  description: {
    flex: 1,
    marginLeft: wp(0.5),
  },
  listTitle: {
    fontSize: wp(3),
    fontWeight: '700',
  },
  unitSign: {
    height: wp(5),
    width: wp(5),
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    lineHeight: wp(5),
    fontSize: wp(3),
  },
  unitQuantity: {
    height: wp(10),
    width: wp(),
    marginLeft: wp(5),
    marginRight: wp(5),
    textAlign: 'center',
    fontSize: wp(3),
    color: '#000000',
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'center',
  },
  units: {
    flexDirection: 'row',
    height: hp(4.8),
  },
  units1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  textServices: {
    fontSize: wp(3),
    color: '#222',
    fontWeight: '700',
  },
  textServices1: {
    fontSize: wp(3),
    color: '#333',
    fontWeight: '700',
  },
  serviceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: hp(0.5),
    alignItems: 'center',
    marginBottom: wp(1),
  },
  viewService: {
    padding: wp(1),
  },
  deleteButton: {
    backgroundColor: '#ca2424',
    height: wp(7),
    width: wp(7),
    borderRadius: wp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    height: wp(4),
    aspectRatio: 1 / 1,
    marginLeft: 4,
  },
  unitButton: {
    width: wp(5),
    height: wp(5),
    backgroundColor: '#056393',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  unitButtonText: {
    color: '#fff',
    fontSize: wp(3),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: hp(5),
    fontSize: wp(3.5),
    marginHorizontal: wp(2),
    borderRadius: 5,
    textAlign: 'center',
    minWidth: wp(20),
    textAlignVertical: 'bottom',
  },
  updateButton: {
    backgroundColor: '#056393',
    height: hp(5),
    paddingHorizontal: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
