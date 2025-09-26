import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  AppState,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import HeaderComponent from '../components/HeaderComponent';
import HomeServiceListComponent from '../components/HomeServiceListComponent';
import FooterComponent from '../components/FooterComponent';
import SafeAreaView from 'react-native-safe-area-view';
import ImageSlider from 'react-native-image-slider';
import CustomLoader from '../components/CustomLoader';

import basicStyles from '../styles/BasicStyles';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {KEYS, getData, storeData} from '../api/UserPreference';

export let homeScreenFetchNotificationCount = null;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      showProcessingLoader: false,
      images: [],
      categories: null,
      cartItemCount: 0,
      notificationCount: 0,
      appState: AppState.currentState,
      isListRefreshing: false,
      searchTerm: '',
      searchResults: [],
      selectedFilter: 'brand',
      name: '',
    };
  }

  intervalID;

  componentDidMount() {
    homeScreenFetchNotificationCount = this.fetchNotificationCount;
    AppState.addEventListener('change', this.handleAppStateChange);
    this.fetchSliderImages();
    this.fetchHomeScreen();
    this.fetchCartItemsCount();
    this.handleSearch();
  }

  componentWillUnmount() {
    homeScreenFetchNotificationCount = null;
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  fetchHomeScreen = async () => {
    try {
      let params = null;
      const response = await makeRequest(
        BASE_URL + 'categories',
        params,
        true,
        true,
      );

      if (response) {
        const {success} = response;

        if (success) {
          const {categories} = response;

          this.setState({
            categories,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            categories: null,
            isLoading: false,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchCartItemsCount = async () => {
    try {
      let params = null;

      const response = await makeRequest(
        BASE_URL + 'cartCount',
        params,
        true,
        false,
      );

      if (response) {
        const {success} = response;

        if (success) {
          const {cartCount} = response;
          let cartItemCount = cartCount;
          await storeData(KEYS.CART_ITEM_COUNT, {cartItemCount});

          this.setState({
            cartItemCount: cartCount,
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

  fetchSliderImages = async () => {
    try {
      const response = await makeRequest(BASE_URL + 'sliders', true, true);

      if (response) {
        const {success} = response;

        if (success) {
          const {sliders} = response;
          const images = sliders.map((item) => item.image);
          this.setState({images, isListRefreshing: false});

          await this.fetchNotificationCount();
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchNotificationCount = async () => {
    try {
      let params = null;

      const response = await makeRequest(
        BASE_URL + 'getNotificationCount',
        params,
        true,
        true,
      );

      if (response) {
        const {success} = response;

        if (success) {
          const {notificationCount} = response;
          await storeData(KEYS.NOTIFICATION_COUNT, {notificationCount});
          this.setState({
            notificationCount,
            isLoading: false,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleAppStateChange = async (nextAppState) => {
    try {
      const {appState} = this.state;
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        await this.fetchNotificationCount();
      }

      this.setState({appState: nextAppState});
    } catch (error) {
      console.log(error.message);
    }
  };

  handleListRefresh = async () => {
    try {
      this.setState({isListRefreshing: true});
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <HomeServiceListComponent
      item={item}
      nav={this.props.navigation}
      handleAddToCart={this.handleAddToCart}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleSearch = async (searchTerm) => {
    try {
      if (searchTerm.length < 1) {
        this.setState({searchResults: []});
        return;
      }

      // Prepare the filter type based on the selected filter
      const {selectedFilter} = this.state;
      const filterType = selectedFilter.toLowerCase(); // Convert filter to lowercase if needed

      // Create FormData instance
      const formData = new FormData();
      formData.append('keyword', searchTerm);
      formData.append('product_brand', filterType); // Include the selected filter

      const response = await fetch(
        'https://nusearchpharma.com/api/Mobile/productSearch',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );
      const data = await response.json();
      console.log('dadsada', data);
      if (data.success) {
        const uniqueResults = [...new Set(data.Products)];
        this.setState({searchResults: uniqueResults});
      } else {
        console.error('Error searching products:', data.error);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  handleSearch2 = async () => {
    try {
      const {name, selectedFilter} = this.state;
      console.log('Item being navigated with:', selectedFilter);
      this.props.navigation.navigate('Product2', {name, brand: selectedFilter});
      this.setState({
        isListRefreshing: false,
        // Reset search term and results if necessary
        name: '',
      });
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  handleProductPress = (item) => {
    // Ensure 'item' contains 'filterType'
    const brand = this.state.selectedFilter;
    console.log('Item being navigated with:', brand);
    this.props.navigation.navigate('Product2', {item, brand});
    this.setState({
      isListRefreshing: false,
      searchTerm: '',
      searchResults: [],
      filterType: '',
    });
  };
  renderProductItem = ({item}) => {
    if (!item) {
      return (
        <View style={{alignItems: 'center', paddingVertical: wp(2)}}>
          <Text>No Data</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => this.handleProductPress(item)}>
        <View style={{borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
          <Text style={{marginBottom: wp(2)}}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  handleRefreshData = () => {
    this.setState({refreshData: true}); // Set the refreshData flag to true
  };
  handleRefreshData = async () => {
    this.setState({isListRefreshing: true});
    await this.handleSearch(this.state.searchTerm);
    // await this.handleSearch2(this.state.name);
    await this.handleDropdownSelect(this.state.selectedFilter);
    this.setState({isListRefreshing: false});
  };

  handleDropdownSelect = (index, value) => {
    const filterMap = {
      Brand: 'brand',
      Salt: 'salt',
    };
    this.setState({selectedFilter: filterMap[value]});
  };

  render() {
    const {
      images,
      isLoading,
      cartItemCount,
      searchTerm,
      searchResults,
      selectedFilter,
      name,
    } = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {notificationCount} = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <HeaderComponent
          headerTitle="Home"
          nav={this.props.navigation}
          showCartIcon
          showNotificationIcon
          notificationCount={notificationCount}
          tapNote="HomeTap"
        />

        <View style={basicStyles.mainContainer}>
          <View style={styles.searchInputContainer}>
            {selectedFilter === 'salt' ? (
              <TextInput
                style={styles.searchInput}
                placeholder="Search Salt Product..."
                placeholderTextColor="#aaa"
                value={this.state.name}
                onChangeText={(text) => this.setState({name: text})}
              />
            ) : (
              <TextInput
                style={styles.searchInput}
                placeholder="Search Product..."
                placeholderTextColor="#aaa"
                value={searchTerm}
                onChangeText={(searchTerm) => {
                  this.setState({searchTerm});
                  this.handleSearch(searchTerm);
                }}
              />
            )}

            <ModalDropdown
              options={['Brand', 'Salt']}
              defaultValue={'Brand'}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownDropdownStyle}
              dropdownTextStyle={styles.dropdownTextItem} // Style for dropdown items
              onSelect={this.handleDropdownSelect}
            />
            {selectedFilter === 'salt' && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#056393',
                  padding: wp(2.5),
                  borderRadius: wp(2),
                  marginLeft: wp(3),
                }}
                onPress={this.handleSearch2} // Ensure handleSearch2 is called without arguments
              >
                <Image
                  source={require('../assets/icons/searchwhite.png')}
                  style={{height: hp(2.8), aspectRatio: 1 / 1}}
                />
              </TouchableOpacity>
            )}
          </View>

          {searchTerm.length > 0 ? (
            <View style={styles.searchResultsContainer}>
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  renderItem={this.renderProductItem}
                  keyExtractor={(item) => item.id.toString()}
                  onRefresh={this.handleRefreshData}
                  refreshing={this.state.isListRefreshing}
                  style={styles.searchResultsList}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No Result Found</Text>
                </View>
              )}
            </View>
          ) : null}

          <View style={styles.sliderContainer}>
            <ImageSlider
              loop
              loopBothSides
              autoPlayWithInterval={2000}
              images={images}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>

          <View style={basicStyles.mainContainer}>
            <FlatList
              data={this.state.categories}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              numColumns={2}
              contentContainerStyle={styles.listContainer}
              onRefresh={this.handleListRefresh}
              refreshing={this.state.isListRefreshing}
            />
          </View>
        </View>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(2),
    margin: wp(2),
    // backgroundColor: '#fff',
  },
  searchInput: {
    height: hp(6),
    fontSize: wp(3.5),
    flex: 1,
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
  },
  dropdown: {
    height: hp(6),
    width: wp(25), // Adjust width to fit better
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  dropdownText: {
    fontSize: wp(3.5),
    textAlign: 'center',
    color: '#333',
  },
  dropdownDropdownStyle: {
    width: wp(25), // Match dropdown width
    height: wp(20),
    borderRadius: wp(2),
    paddingVertical: 0, // Remove extra padding
    // backgroundColor: '#000',
  },
  dropdownTextStyle: {
    fontSize: wp(3.5),
    textAlign: 'center',
    color: '#333',
  },
  dropdownTextHighlightStyle: {
    fontSize: wp(3.5),
    textAlign: 'center',
    color: '#007bff',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: hp(8),
    left: wp(2),
    right: wp(2),
    backgroundColor: '#fff',
    borderRadius: wp(2),
    elevation: 3,
    zIndex: 999,
  },
  searchResultsList: {
    maxHeight: hp(30),
    borderRadius: wp(2),
    padding: wp(2),
  },
  sliderContainer: {
    height: wp(51.5),
    width: wp(100),
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  listContainer: {
    padding: wp(1),
  },
  separator: {
    height: wp(2),
  },
  notificationIcon: {
    width: wp(5.6),
    height: wp(5.6),
  },
  notificationIconContainer: {
    marginLeft: wp(3),
  },
  sliderImage: {
    aspectRatio: 3 / 1,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: wp(2),
  },
  noResultsText: {
    fontSize: wp(3),
    fontWeight: 'bold',
  },
});
