import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerOuter: {
    flex: 1,
    backgroundColor: 'black'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  heading: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 80,
    width: '100%',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  smButton: {
    width: 50,
    borderRadius: 15,
    padding: 0,
    alignItems: 'center',
    backgroundColor: '#999999',
  },
  arrowButton: {
    padding: 0,
    backgroundColor: '#999999',
    opacity: 0.2,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 260,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    padding: 20,
    color: 'white',
  },
  statusLabelConnected: {
    marginBottom: 20,
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    //borderRadius: 5,
    //borderWidth: 1,
    //borderColor: '#cccccc',
  },
  statusLabelNotConnected: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 5,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
