import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class ProductComponent extends Component {
  constructor(props) {
    super(props);
    // preparing info
    const {item} = this.props;
    const {name, mrp, image, description, netPrice, doctorMargin, id} = item;

    this.state = {
      // quantity: 1,
      // quantityValue: '',
      productId: id,
      linesNumber: 2,
      placeHolderValue: 500,
      modalVisible: false,
      quantity: 0,
      quantityValue: '0',
      incrementCount: 0, // new state variable to track increment count
    };
  }

  handleAdd = async () => {
    try {
      await this.props.handleAddToCart(this.props.item.id, this.state.quantity);
      this.setState({quantity: 1});
    } catch (error) {
      console.log(error.message);
    }
  };

  handleQuantityChange = (text) => {
    let quantity = parseInt(text);
    if (!isNaN(quantity)) {
      this.setState({quantityValue: text, quantity: quantity});
    } else {
      this.setState({quantityValue: '', quantity: 0});
    }
  };
  decrementQuantity = () => {
    this.setState((prevState) => {
      const newQuantity = prevState.quantity > 1 ? prevState.quantity - 1 : 1;
      return {quantity: newQuantity};
    });
  };

  incrementQuantity = () => {
    const {quantityValue, incrementCount} = this.state;

    if (quantityValue === '') {
      this.setState({
        quantity: 0,
        quantityValue: '0',
      });
    } else {
      let incrementValue = 1;
      if (incrementCount > 0) {
        incrementValue = 2;
      }
      this.setState((prevState) => ({
        quantity: prevState.quantity + incrementValue,
        quantityValue: (prevState.quantity + incrementValue).toString(),
        incrementCount: prevState.incrementCount + 1,
      }));
    }
  };

  updateQuantity = (value) => {
    const {quantity, quantityValue} = this.state;
    let newQuantity = quantity;

    if (quantityValue !== '') {
      newQuantity = parseInt(quantityValue) + value;
    } else {
      newQuantity += value;
    }

    if (newQuantity < 1) {
      newQuantity = 1; // Ensure the quantity is always at least 1
    }

    this.setState({
      quantity: newQuantity,
      quantityValue: newQuantity.toString(),
    });
  };

  openModal = () => {
    this.setState({modalVisible: true});
  };

  closeModal = () => {
    this.setState({modalVisible: false});
  };

  render() {
    const {
      name,
      mrp,
      image,
      priceFor,
      description,
      netPrice,
      doctorMargin,
      packingType,
    } = this.props.item;
    const {quantity, quantityValue, modalVisible} = this.state;

    return (
      <View style={styles.section}>
        <View style={styles.sectionMain}>
          <TouchableOpacity onPress={this.openModal}>
            <Image
              source={{uri: image}}
              resizeMode="cover"
              style={styles.serviceImage}
            />
            {packingType ? (
              <Text style={{textAlign: 'center'}}>{packingType}</Text>
            ) : null}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text
              style={styles.description}
              numberOfLines={this.state.linesNumber}
              ellipsizeMode="clip">
              {description}
            </Text>

            {priceFor ? <Text style={styles.priceFor}>{priceFor}</Text> : null}

            <View style={styles.rateDivison}>
              <Text style={styles.listNumber}>MRP: </Text>
              <Text style={styles.inText}>₹ {mrp}</Text>
            </View>

            <View style={styles.rateDivison}>
              <Text style={styles.listNumber}>Net Rate: </Text>
              <Text style={styles.inText}>₹ {netPrice}</Text>
            </View>

            <View style={styles.rateDivison}>
              <Text style={styles.listNumber}>Doctor Margin(%): </Text>
              <Text style={styles.inText}>{doctorMargin}</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputView}>
          <TouchableOpacity onPress={() => this.updateQuantity(-1)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Qty (In Strips)"
            placeholderTextColor="#444"
            keyboardType="numeric"
            value={quantityValue !== '0' ? quantityValue : ''}
            maxLength={5}
            style={styles.quantityInput}
            onChangeText={this.handleQuantityChange}
          />
          <TouchableOpacity onPress={() => this.updateQuantity(1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
          <View style={{flex: 1}} />

          <TouchableOpacity style={styles.addButton} onPress={this.handleAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={this.closeModal}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={this.closeModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>{name}</Text>
                <TouchableOpacity onPress={this.closeModal}>
                  <Image
                    source={require('../assets/icons/cancel.png')}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
              <Image
                source={{uri: image}}
                resizeMode="contain"
                style={styles.modalImage}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 4,
    width: wp(96),
    justifyContent: 'center',
    marginHorizontal: wp(2),
    backgroundColor: '#ffffff',
    marginBottom: hp(2),
  },
  sectionMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateDivison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    padding: wp(3),
  },
  name: {
    fontSize: wp(4.2),
    color: '#056393',
    fontWeight: '700',
    marginBottom: hp(0.5),
  },
  description: {
    fontSize: wp(3.2),
    color: '#333',
    marginBottom: hp(0.5),
  },
  priceFor: {
    fontSize: wp(3.2),
    color: '#333',
    fontWeight: '700',
    paddingBottom: hp(0.5),
  },
  inText: {
    fontSize: wp(3),
    color: '#333',
    fontWeight: '700',
  },
  serviceImage: {
    height: hp(12),
    aspectRatio: 1.5 / 1,
    marginBottom: wp(0.5),
    alignSelf: 'center',
    borderRadius: 4,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: wp(3),
    marginBottom: wp(3),
  },
  quantityButton: {
    fontSize: wp(4),
    color: '#056393',
    fontWeight: '700',
    padding: wp(2),
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#AAA',
    height: hp(5),
    width: wp(25),
    borderRadius: 5,
    textAlign: 'center',
    fontSize: wp(3),
  },
  addButton: {
    backgroundColor: '#056393',
    height: hp(5),
    paddingHorizontal: wp(4),
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  addButtonText: {
    color: '#fff',
    fontSize: wp(3.5),
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: wp(5),
    borderRadius: wp(2),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalHeaderText: {
    fontSize: wp(4),
    color: '#056393',
    fontWeight: '700',
  },
  closeIcon: {
    width: wp(5),
    height: wp(5),
  },
  modalImage: {
    width: wp(80),
    height: wp(80),
    alignSelf: 'center',
  },
});
