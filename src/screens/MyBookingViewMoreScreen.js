import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, BackHandler} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';

import FooterComponent from '../components/FooterComponent';

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {getData, KEYS, clearData, storeData} from '../api/UserPreference';

export default class MyBookingViewMoreScreen extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const product = navigation.getParam('product', null);
    this.product = product;
    this.state = {
      notificationCount: 0,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = async () => {
    try {
      this.props.navigation.pop();
    } catch (error) {
      console.log(error.message);
    }
  };

  // const renderItem = ({item}) => <BookingViewMoreComponent item={item} />;

  // const keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  renderCategory = ({item}) => (
    <View style={styles.mainContainer}>
      <View style={styles.section}>
        <View style={styles.sectionList}>
          <Text style={styles.item}>Product Name:</Text>
          <Text style={styles.item1}>{item.productName}</Text>
        </View>

        <View style={styles.sectionList}>
          <Text style={styles.item}>Product Quantity :</Text>
          <Text style={styles.item1}>{item.quantity}</Text>
        </View>

        <View style={styles.sectionList}>
          <Text style={styles.item}>Product Amount :</Text>
          <Text style={styles.item1}>₹ {item.totalProductAmount}</Text>
        </View>

        <View style={styles.sectionList}>
          <Text style={styles.item}>GST Amount({item.totalGst}%) :</Text>
          <Text style={styles.item1}>₹ {item.gst}</Text>
        </View>
      </View>
    </View>
  );

  render() {
    const {notificationCount} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="More About Bookings"
          navAction="back"
          nav={this.props.navigation}
        />
        <View style={styles.flatContainer}>
          <Text style={styles.headText}>Booked Products</Text>
        </View>
        <FlatList
          data={this.product}
          renderItem={this.renderCategory}
          keyExtractor={(item) => `${item.id}`}
          ItemSeparatorComponent={this.itemSeparator}
        />

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
  },

  flatContainer: {
    paddingVertical: wp(2),
  },
  headText: {
    marginLeft: wp(2),
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#056393',
  },
  listContainer: {
    paddingVertical: wp(2),
  },

  mainContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginHorizontal: wp(1.5),
    padding: wp(1),
  },
  section: {
    margin: wp(1),
  },
  sectionList: {
    flexDirection: 'row',
    paddingBottom: wp(1),
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    fontSize: wp(3),
    color: '#333',
    fontWeight: '700',
    paddingStart: wp(1),
  },
  item1: {
    fontSize: wp(3),

    paddingRight: wp(2),
  },
  separator: {
    height: wp(2),
  },
});
