import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import NotificationListComponent from '../components/NotificationListComponent';
import CustomLoader from '../components/CustomLoader';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: null,
      isLoading: true,
      status: null,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.fetchNotifications();
    this.resetNotificationCount();
  }

  fetchNotifications = async () => {
    try {
      //  starting loader
      // this.setState({isLoading: true});
      let params = null;

      const response = await makeRequest(
        BASE_URL + 'notifications',
        params,
        true,
        true,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          const {notifications} = response;

          this.setState({
            notifications,
            isLoading: false,
            status: null,
            isListRefreshing: false,
          });

          // resetting notification count
          await this.resetNotificationCount();
        } else {
          const {message} = response;

          this.setState({
            status: message,
            notifications: null,
            isLoading: false,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  resetNotificationCount = async () => {
    try {
      let params = null;

      // calling api
      const response = await makeRequest(
        BASE_URL + 'resetNotificationCount',
        params,
        true,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          //firebase.notifications().removeAllDeliveredNotifications();
          this.setState({isLoading: false, isListRefreshing: false});
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
    <NotificationListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {notifications, status, isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Notification"
          navAction="back"
          nav={this.props.navigation}
        />
        {notifications ? (
          <View style={styles.galleryContainer}>
            <FlatList
              data={notifications}
              renderItem={this.renderItem}
              showsHorizontalScrollIndicator={false}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesListContent}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{status}</Text>
          </View>
        )}
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  notificationContainer: {
    flex: 1,
  },
  separator: {
    height: wp(2),
  },
  listContainer: {
    padding: wp(2),
  },
  galleryContainer: {
    flex: 1,
  },
  notesListContent: {
    padding: wp(2),
  },

  messageContainer: {
    flex: 1,
    padding: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#000',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});
