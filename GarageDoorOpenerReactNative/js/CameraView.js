import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import globalState from './state';
import Foscam from './foscam';
import  { BASE_URL_WITH_AUTH } from '../config';
import styles from './styles';
import ProgressImage from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';


const IMG_W = 360;
const IMG_H = IMG_W / (4/3);
const BTN_W = 50;
const REFRESH_DELAY_MS = 250;
const REFRESH_DELAY_ERROR_MS = 2500;

export default class CameraView extends Component {
  constructor(props) {
    super(props);
    this.foscam = new Foscam(props.id);
    this.state = {counter: 0, progress: null, focusChange: 0};
    this.loadedOnce = false;
  }

  componentDidMount() {
    this.setState({counter: 1});

    this.props.navigation.addListener('focus', () => {
      this.setState({focusChange: this.state.focusChange + 1});
    });
  }

  componentWillUnmount() {
    clearTimeout(this.handle);
  }

  render() {
    if (!this.props.navigation.isFocused()) {
      this.loadedOnce = false;
      if (this.state.progress) {
        setTimeout(() => this.setState({progress: 0}), 0);
      }
      return <View />;
    }
    var { progress } = this.state;
    if (this.loadedOnce) {
      progress = null;
    } else if (progress && progress.loaded && progress.total) {
      progress = (progress.loaded / progress.total);
    } else {
      progress = 0.02;
    }
    return (
      <View style={styles.container}>
        <View style={{marginTop: 150, height: IMG_H}}>

          <View style={{width: IMG_W, height: IMG_H}}>
            <Image style={{width: IMG_W, height: IMG_H}}
                  source={{uri: `${BASE_URL_WITH_AUTH}/${this.props.id}.jpg?cb=${this.state.counter}`}}
                  onLoad={() => {
                    this.loadedOnce = true;
                    clearTimeout(this.handle);
                    this.handle = setTimeout(() => this.setState({ counter: this.state.counter+1 }), REFRESH_DELAY_MS);
                  }}
                  onError={(err) => {
                    this.loadedOnce = false;
                    clearTimeout(this.handle);
                    this.handle = setTimeout(() => this.setState({ counter: this.state.counter+1 }), REFRESH_DELAY_ERROR_MS);
                  }}
                  onProgress={({nativeEvent}) => {
                    this.setState({progress: nativeEvent});
                  }}
                  />
            {this.loadedOnce ? null : (
              <View style={{position:'absolute',width:IMG_W-2,bottom:0}}>
                <ProgressBar progress={progress}
                             width={null} borderRadius={0} height={3}
                             borderWidth={0}
                             animationType={'timing'} />
              </View>
            )}
          </View>

          <TouchableOpacity style={{position:'absolute', top:0, left:0, height:BTN_W, width:IMG_W}}
            onPressIn={() => this.foscam.up(false)}
            onPressOut={() => this.foscam.stop()}
            >
            <View style={styles.arrowButton}><Text style={styles.buttonText}>▲</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={{position:'absolute', top:BTN_W, left:0, height:IMG_H - (2*BTN_W), width:BTN_W}}
            onPressIn={() => this.foscam.left(false)}
            onPressOut={() => this.foscam.stop()}
            >
            <View style={styles.arrowButton}><Text style={styles.buttonText}>◀</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={{position:'absolute', top:BTN_W, right:0, height:IMG_H - (2*BTN_W), width:BTN_W}}
            onPressIn={() => this.foscam.right(false)}
            onPressOut={() => this.foscam.stop()}
            >
            <View style={styles.arrowButton}><Text style={styles.buttonText}>▶</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={{position:'absolute', bottom: 0, left:0, height:BTN_W, width:IMG_W}}
            onPressIn={() => this.foscam.down(false)}
            onPressOut={() => this.foscam.stop()}
            >
            <View style={styles.arrowButton}><Text style={styles.buttonText}>▼</Text></View>
          </TouchableOpacity>

        </View>
        <View style={{marginTop: 20, height: IMG_H}}>
          <Text style={{color:'grey'}}>Tap or press edges of image to pan camera</Text>
        </View>
      </View>
    );
  }
}
