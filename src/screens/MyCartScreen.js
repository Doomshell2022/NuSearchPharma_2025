import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  FlatList,
  BackHandler,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import MyCartListComponent from '../components/MyCartListComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import CustomLoader from '../components/CustomLoader';
import {showToast} from '../components/CustomToast';

// Icons
import ic_next from '../assets/icons/ic_next.png';

// Styles
import basicStyles from '../styles/BasicStyles';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';

//UserPreference
import {getData, KEYS, storeData} from '../api/UserPreference';

export default class AllCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      showProcessingLoader: false,
      productInfo: null,
      totalProduct: 0,
      totalGstAmount: 0,
      totalAmount: 0,
      totalFreight: 0,
      totalPayableAmount: 0,
      totalWeight: 0,
      status: null,
      cartDetail: null,
      cartItemCount: 0,
      quantity: '',
      isListRefreshing: false,
      notificationCount: 0,
      grossAmount: 0,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchCart();
    this.fetchCartItemsCount();
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = async () => {
    try {
      const tapNote = this.props.navigation.getParam('tapNote', null);
      const item = this.props.navigation.getParam('item', null);
      console.log('Tap NOte is==', tapNote);

      if (tapNote === 'HomeTap') {
        this.props.navigation.push('Home');
      } else if (tapNote === 'productTap') {
        const {tapNote, items} = this.props;

        this.props.navigation.push('Product', {item});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchCart = async () => {
    try {
      this.setState({isLoading: true});

      let params = null;
      // calling api
      const response = await makeRequest(
        BASE_URL + 'viewCart',
        params,
        true,
        true,
      );
      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {cartDetail} = response;
          const {
            totalProduct,
            totalGstAmount,
            totalAmount,
            totalFreight,
            totalPayableAmount,
            totalWeight,
            productInfo,
            grossAmount,
          } = cartDetail;

          this.setState({
            totalProduct,
            totalGstAmount,
            totalAmount,
            grossAmount,
            totalFreight,
            totalPayableAmount,
            totalWeight,
            productInfo,
            isLoading: false,
            isListRefreshing: false,
          });

          await this.fetchCartItemsCount();
        } else {
          const {message} = response;
          this.setState({
            productInfo: null,
            status: message,
            cartDetail: null,

            isLoading: false,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleAddToCart = async (productId, quantity) => {
    if (quantity === 0) {
      console.log('0');
      Alert.alert('Alert!', 'Please Enter Valid Quantity.', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (quantity === '') {
      console.log('Blank');
      Alert.alert('Alert!', 'Please Enter Valid Quantity.', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (!quantity) {
      console.log('Null');
      Alert.alert('Alert!', 'Please Enter Valid Quantity.', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // preparing params
      const params = {
        productId,
        quantity,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'addToCart',
        params,
        true,
        false,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          this.setState({showProcessingLoader: false, isListRefreshing: false});
          showToast(message);
          await this.componentDidMount();
        } else {
          this.setState({showProcessingLoader: false, isListRefreshing: false});
          Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchCartItemsCount = async () => {
    try {
      this.setState({isLoading: true});
      let params = null;

      // calling api
      const response = await makeRequest(
        BASE_URL + 'cartCount',
        params,
        true,
        false,
      );
      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {cartCount} = response;
          let cartItemCount = cartCount;
          console.log('cartio', cartItemCount);
          await storeData(KEYS.CART_ITEM_COUNT, {cartItemCount});

          this.setState({
            cartItemCount,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({isLoading: false, isListRefreshing: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOrderCart = async () => {
    try {
      this.setState({showProcessingLoader: true});

      let params = null;
      // calling api
      const response = await makeRequest(
        BASE_URL + 'orderCart',
        params,
        true,
        false,
      );
      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          const {orderInfo} = response;
          const {orderId, amount} = orderInfo;
          this.props.navigation.push('Place');
          this.setState({showProcessingLoader: false, isListRefreshing: false});
          Alert.alert('Info!', message, [{text: 'OK'}], {
            cancelable: false,
          });
          //await this.handleAddToCart();
        } else {
          Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          });
          this.setState({
            orderInfo: null,
            showProcessingLoader: false,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
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

  handleRemoveItem = async (productId) => {
    try {
      this.setState({isLoading: true});

      // preparing params
      const params = {
        productId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'deleteCart',
        params,
        true,
        false,
      );
      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          this.setState({isLoading: false, isListRefreshing: false});
          Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          });
          await this.componentDidMount();
        } else {
          this.setState({isLoading: false, isListRefreshing: false});
          Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  cartItem = ({item}) => (
    <MyCartListComponent
      item={item}
      nav={this.props.navigation}
      handleAddToCart={this.handleAddToCart}
      handleRemoveItem={this.handleRemoveItem}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading, status} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      totalProduct,
      totalGstAmount,
      totalAmount,
      totalFreight,
      totalPayableAmount,
      totalWeight,
      productInfo,
      cartItemCount,
      grossAmount,
    } = this.state;

    const tapNote = this.props.navigation.getParam('tapNote', null);
    const item = this.props.navigation.getParam('item', null);
    console.log('Tap NOte is==', tapNote);
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="My Cart"
          navAction="back"
          nav={this.props.navigation}
          cartItemCount={cartItemCount}
          tapNote="My Cart"
          items={item}
        />
        {productInfo ? (
          <View style={styles.mainContainer}>
            <View style={styles.mainContainer}>
              <View
                style={[
                  basicStyles.whiteBackgroundColor,
                  basicStyles.margin,
                  styles.borderView,
                ]}>
                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.padding,
                    basicStyles.justifyBetween,
                  ]}>
                  <View style={[basicStyles.directionRow, styles.alignView]}>
                    <Text style={[basicStyles.heading]}>Total Product</Text>
                    <Text style={[basicStyles.heading, styles.themeTextColor]}>
                      {' '}
                      ({totalProduct})
                    </Text>
                  </View>

                  <View style={[basicStyles.directionRow, styles.alignView]}>
                    <Text style={[basicStyles.heading]}>Gross Amount {}:</Text>
                    <Text
                      style={[basicStyles.heading, basicStyles.themeTextColor]}>
                      {} ₹ {grossAmount}
                    </Text>
                  </View>
                </View>

                {/*     <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.padding,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                    Total Weight : {totalWeight}
                  </Text>
                  <Text
                    style={[basicStyles.heading, basicStyles.themeTextColor]}>
                    Total Freight : ₹ {totalFreight}
                  </Text>
                </View> */}

                {/*  <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.padding,
                    basicStyles.justifyBetween,
                  ]}>
                  <View style={[basicStyles.directionRow, styles.alignView]}>
                    <Text style={[basicStyles.heading]}>Total Weight {}:</Text>
                    <Text style={[basicStyles.heading, styles.themeTextColor]}>
                      {} {totalWeight}
                    </Text>
                  </View>

                  <View style={[basicStyles.directionRow, styles.alignView]}>
                    <Text style={[basicStyles.heading]}>Total Freight {}:</Text>
                    <Text
                      style={[basicStyles.heading, basicStyles.themeTextColor]}>
                      {} ₹ {totalFreight}
                    </Text>
                  </View>
                </View> */}

                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.padding,
                    basicStyles.justifyBetween,
                  ]}>
                  <View style={[basicStyles.directionRow, styles.alignView]}>
                    <Text style={[basicStyles.heading]}>Total GST {}:</Text>
                    <Text style={[basicStyles.heading, styles.themeTextColor]}>
                      {} ₹ {totalGstAmount}
                    </Text>
                  </View>

                  <View style={[basicStyles.directionRow, styles.alignView]}>
                    <Text style={[basicStyles.heading]}>
                      Payable Amount {}:
                    </Text>
                    <Text
                      style={[basicStyles.heading, basicStyles.themeTextColor]}>
                      {} ₹ {totalPayableAmount}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cartListContainer}>
                <FlatList
                  data={productInfo}
                  renderItem={this.cartItem}
                  keyExtractor={this.keyExtractor}
                  // horizontal={true}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              </View>
            </View>

            <TouchableHighlight
              style={styles.checkoutButton}
              onPress={this.handleOrderCart}
              underlayColor="#ffffff80">
              <View style={styles.checkoutButtonView}>
                <Text style={styles.checkoutButtonText}>Place Order</Text>
                <View style={styles.checkoutContainer}>
                  <Text style={styles.checkoutButtonText}>
                    ₹ {totalPayableAmount}
                  </Text>
                  <Image
                    source={ic_next}
                    resizeMode="cover"
                    style={styles.next}
                  />
                </View>
              </View>
            </TouchableHighlight>
          </View>
        ) : (
          <View style={basicStyles.noDataStyle}>
            <Text style={basicStyles.noDataTextStyle}>{status}</Text>
          </View>
        )}
        {this.state.showProcessingLoader && <ProcessingLoader />}
        {/* <FooterComponent nav={this.props.navigation} /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },

  mainContainer: {
    flex: 1,
  },

  cartListContainer: {
    flex: 1,
  },
  separator: {
    height: wp(2),
  },
  listContainer: {
    padding: wp(2),
  },
  checkoutButton: {
    padding: wp(1),
  },
  checkoutButtonView: {
    backgroundColor: '#056393',
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    borderRadius: 4,
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  next: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  borderView: {
    borderRadius: 4,

    padding: wp(2),
  },
  payableAmountView: {
    alignSelf: 'flex-end',
  },
  alignView: {
    alignItems: 'center',
    marginBottom: wp(1),
  },
  themeTextColor: {
    color: '#056393',
  },
});
