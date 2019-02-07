import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Image,
  NetInfo,
  ScrollView,
  StyleSheet,
  TabBarIOS,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import  { BASE_URL, BASE_URL_WITH_AUTH, USERNAME, PASSWORD } from '../config';
import globalState from './state';
import HomeView from './HomeView';
import CameraView from './CameraView';
import styles from './styles';
import GaragePi from './garagepi';

var garage = new GaragePi();
garage.connect();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      status: garage.status,
      door: garage.door,
      log: [],
    };

    NetInfo.getConnectionInfo().then((e) => this._handleConnectivityChange(e));
    NetInfo.addEventListener('connectionChange', (e) => this._handleConnectivityChange(e));
  }

  componentDidMount() {
    garage.connect((g) => {
      this._log(`Garage state changed: ${g.status}`);
      this.setState({
        status: g.status,
        door: g.door,
      });
    });
  }

  componentWillUnmount() {
  }

  _handleConnectivityChange(connectionInfo) {
    this._log(`Connection changed to ${connectionInfo.type}`);
    garage.connect();
  }

  _log(msg) {
    var newLog = [`${(new Date).toLocaleString()} - ${msg}`].concat(this.state.log);
    if (newLog.length > 100) {
      newLog.length = 100;
    }
    this.setState({log: newLog});
  }

  _onPressButton() {
    const id = this.state.door.id;
    this._log(`Toggled door ${id} from ${this.state.door.state}`);
    garage.toggleButton(id)
      .then((r) => { garage.connect(); })
      .catch((err) => { Alert.alert('Sorry, that did not seem to work.'); })
  }

  render() {
    globalState.currentTab = this.state.selectedTab; //track in global scope due to weird behavior in mounting/props behaviro in TabBarIOS
    return (
      <View style={styles.containerOuter}>
        <TabBarIOS>
          <Icon.TabBarItem
            title="Home"
            iconName="rocket"
            selectedIconName="rocket"
            selected={ this.state.selectedTab === 'home' }
            onPress={() => this.setState({selectedTab: 'home'})}
            >
            <HomeView status={this.state.status}
                      door={this.state.door}
                      onToggleDoor={() => this._onPressButton()}
              />
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Cam 1"
            iconName="picture-o"
            selectedIconName="picture-o"
            selected={ this.state.selectedTab === 'cam1' }
            onPress={() => this.setState({selectedTab: 'cam1'})}
          >
            <CameraView id={'cam1'} />
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Cam 2"
            iconName="picture-o"
            selectedIconName="picture-o"
            selected={ this.state.selectedTab === 'cam2' }
            onPress={() => this.setState({selectedTab: 'cam2'})}
          >
            <CameraView id={'cam2'} />
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Log"
            iconName="bars"
            selectedIconName="bars"
            selected={ this.state.selectedTab === 'log' }
            onPress={() => this.setState({selectedTab: 'log'})}
          >
            <View style={styles.container}>
              <ScrollView>
                <Text>{this.state.log.join('\n')}</Text>
              </ScrollView>
            </View>
          </Icon.TabBarItem>
        </TabBarIOS>
      </View>
    );
  }
}


AppRegistry.registerComponent('App', () => App);
