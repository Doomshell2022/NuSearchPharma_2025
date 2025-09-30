import React, {Component} from 'react';
import {View, FlatList, Text, Image, Alert, SafeAreaView} from 'react-native';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import ProductDetailComponent from '../components/ProductDetailComponent';
import {showToast} from '../components/CustomToast';
import {getData, KEYS, storeData} from '../api/UserPreference';
import CustomLoader from '../components/CustomLoader';
import HeaderComponent from '../components/HeaderComponent';
import ProcessingLoader from '../components/ProcessingLoader';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class ProductDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      isLoading: true,
      error: null,
      showProcessingLoader: false,
      refreshData: false,
    };
  }

  componentDidMount() {
    this.fetchProductScreen();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the refreshData flag has changed
    if (
      prevState.refreshData !== this.state.refreshData &&
      this.state.refreshData
    ) {
      this.fetchProductScreen(); // Fetch the updated data
      this.setState({refreshData: false}); // Reset the flag
    }
  }

  fetchProductScreen = async () => {
    try {
      // Retrieve parameters from navigation
      const item = this.props.navigation.getParam('item');
      const brand = this.props.navigation.getParam('brand');
      const e = this.props.navigation.getParam('name'); // Retrieve 'e'

      // Determine which value to use
      const name = item ? item.name : e; // Use 'name' from item if available, otherwise use 'e'

      console.log('Brand:', brand); // Log the brand
      console.log('Search Term:', name); // Log the chosen search term

      // Create params object including 'brand'
      const params = {keyword: name, product_brand: brand};

      // Send the request
      const response = await makeRequest(
        BASE_URL + 'searchResult',
        params,
        true,
        false,
      );

      if (response && response.success) {
        const {products} = response;
        this.setState({
          products,
          isLoading: false,
          error: null,
        });
      } else {
        const error = response ? response.message : 'Error searching products';
        this.setState({
          products: null,
          isLoading: false,
          error,
        });
      }
    } catch (error) {
      console.log('Error searching products:', error);
      this.setState({
        products: null,
        isLoading: false,
        error: 'Error searching products',
      });
    }
  };

  handleAddToCart = async (productId, quantity) => {
    console.log(quantity);

    if (quantity === 0 || quantity === '' || !quantity) {
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
          showToast(message);
          this.props.navigation.navigate('MyCart');

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

  renderItem = ({item}) => (
    <ProductDetailComponent
      item={item}
      nav={this.props.navigation}
      handleAddToCart={this.handleAddToCart}
    />
  );

  handleRefreshData = () => {
    this.setState({refreshData: true}); // Set the refreshData flag to true
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;

  render() {
    const {products, error, isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={{flex: 1}}>
        <HeaderComponent
          headerTitle="Product Detail"
          nav={this.props.navigation}
          navAction="back"
          tapNote="productTap"
          isRefreshing={true}
        />
        {products && products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            onRefresh={this.handleRefreshData} // Add the onRefresh prop
            refreshing={false} // Set the refreshing prop to control the refresh indicator
            ItemSeparatorComponent={this.itemSeparator}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No products found</Text>
          </View>
        )}
        {this.state.showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

export default ProductDetailScreen;
