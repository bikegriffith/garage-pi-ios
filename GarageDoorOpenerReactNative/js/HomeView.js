import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

export default class HomeView extends Component {
  render() {
    const { status, door, onToggleDoor } = this.props;
    return (
      <View style={styles.container}>
        <View style={{marginBottom: 80, width:'100%'}}>
          <StatusLabel status={status} />
        </View>
        {status == 'connected' ? (
            <View>
              <View style={{flexDirection: 'row'}}>
                {false ? <Icon name={door.state == 'closed' ? 'lock' : 'unlock'} size={25} style={{color:'#ccc', marginRight:15}} /> : null}
                <Text style={styles.heading}>The garage is {door.state}</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={onToggleDoor} style={{marginBottom:80}}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>⇧  Toggle  ⇩</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
      </View>
    );
  }
}

function StatusLabel(props) {
  if (props.status == 'connected') {
    return (
      <Text style={styles.statusLabelConnected}>
        <Icon name={'wifi'} /> {'  '} CONNECTED
      </Text>
    );
  } else if (props.status == 'connecting') {
    return (
      <Text style={styles.statusLabelConnected}>
        CONNECTING...
      </Text>
    );
  } else {
    return (
      <Text style={styles.statusLabelNotConnected}>
        {(props.status||'').toUpperCase()}
      </Text>
    );
  }
}

function DateLabel(props) {
  return <Text style={{color: 'grey', textAlign: 'center'}}>{'Last changed ' + new Date(props.door.lastUpdateTS).toLocaleString()}</Text>
}


