import React, {Component} from 'react';
import {
  View,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  BackHandler,
  Text,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

//Component
import HeaderComponent from '../components/HeaderComponent';
import ProductComponent from '../components/ProductComponent';
import FooterComponent from '../components/FooterComponent';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {getData, KEYS, storeData} from '../api/UserPreference';

export default class ProductScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: null,
      isLoading: true,
      isListRefreshing: false,
      showProcessingLoader: false,
      productId: '',
      // quantity: '',
      cartItemCount: 0,
      status: null,
    };
    const item = this.props.navigation.getParam('item', null);

    this.item = item;
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchProductScreen();
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = async () => {
    this.props.navigation.push('Home');
  };

  handleAddToCart = async (productId, quantity) => {
    console.log(quantity);

    if (quantity === 0) {
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

      console.log(params);
      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          // updating cart item count
          const {cartItemCount} = response;
          await storeData(KEYS.CART_ITEM_COUNT, {cartItemCount});
          // Alert.alert('Alert!', message, [{text: 'OK'}], {
          //   cancelable: false,
          // });
          showToast(message);
          this.setState({
            quantity: 1,
            cartItemCount,
            showProcessingLoader: false,
          });
        } else {
          Alert.alert(
            'Alert!',
            message,
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: this.onLogoutYesPress},
            ],
            {
              cancelable: false,
            },
          );
          this.setState({showProcessingLoader: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  onLogoutYesPress = () => {
    this.props.navigation.navigate('Profile');
  };

  fetchProductScreen = async () => {
    try {
      //this.setState({isLoading: true});

      // const item = this.props.navigation.getParam('item', null);
      // console.log('Item', item);
      const item = this.props.navigation.getParam('item', null);
      console.log('Received item:', item);
      if (!item) {
        return;
      }
      const {categoryId} = item;

      const params = {categoryId};
      const response = await makeRequest(
        BASE_URL + 'products',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message} = response;

        if (success) {
          const {products} = response;

          this.setState({
            products,
            //status: null,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            products: null,
            status: message,
            isLoading: false,
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

  renderItem = ({item}) => (
    <ProductComponent
      item={item}
      nav={this.props.navigation}
      handleAddToCart={this.handleAddToCart}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {products, cartItemCount, status, notificationCount} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Product List"
          nav={this.props.navigation}
          navAction="back"
          showCartIcon
          key={cartItemCount}
          tapNote="productTap"
          items={this.item}
        />

        <View style={styles.flatContainer}>
          {products ? (
            <FlatList
              data={products}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              // numColumns={2}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View
              style={[
                basicStyles.container,
                basicStyles.alignCenter,
                basicStyles.justifyCenter,
              ]}>
              <Text style={styles.heading}>{status}</Text>
            </View>
          )}
        </View>
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
  slide: {
    paddingHorizontal: wp(3),
    marginHorizontal: wp(2),
    height: hp(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#009688',
  },
  searchIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: wp(3),
  },
  flatContainer: {
    flex: 1,
  },
  content: {
    color: '#fff',
    fontSize: wp(4),
  },
  separator: {
    height: wp(2),
  },
  listContainer: {
    padding: wp(1),
  },
  heading: {
    fontSize: wp(3.1),

    color: '#222',
  },
});
