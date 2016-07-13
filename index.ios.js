/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import net from 'react-native-tcp'
import {Buffer} from 'buffer'
import Button from 'react-native-button'
import InvertibleScrollView from 'react-native-invertible-scroll-view'

//import nats from './nats'
const lf = '\r\n'

class NatsClient extends Component {

  constructor(props) {
      super(props);

      this.updateChatter = this.updateChatter.bind(this);
      this.state = { chatter: [] };
    }

    updateChatter(msg) {
      this.setState({
          chatter: this.state.chatter.concat([msg])
      });
    }

  componentDidMount() {

    this.setupClient()

  }

  setupClient() {

    //10.56.240.217

    let client = net.createConnection(4222, "10.56.241.15", () => {
      this.updateChatter('opened client on ' + JSON.stringify(client.address()));
    });

    client.on('data', (data) => {

      var buffer = new Buffer(data, 'utf8')
      this.updateChatter('Client Received: ' + buffer.toString());
      if (buffer.toString() === 'PING') {
        this.client.write('PONG' + lf)
      }

    });

    client.on('error', (error) => {
      this.updateChatter('client error ' + error);
    });

    client.on('close', () => {
      this.updateChatter('client close');
    });

    this.client = client

  }

  render() {
    return (
      <View style={styles.container}>
        <Button containerStyle={{backgroundColor:'rgb(8, 133, 35)',borderRadius:10,height:30,width:100,alignItems:'center',justifyContent:'center',margin:5}} style={{color:'white',fontSize:17}}
          onPress={() => { this.setupClient() }} >
          Connect
        </Button>
        <Button containerStyle={styles.button} style={styles.buttonText}
          onPress={() => this.client.write('sub hello 9999' + lf)}>
          Subscribe
        </Button>

        <Button containerStyle={[styles.button,{backgroundColor:'#0c5099'}]} style={styles.buttonText}
          onPress={() => {
            var buffer = new Buffer('PUB hello 7' + lf + 'blue-on' + lf, 'ascii')
            this.client.write(buffer)
          }}>
          Blue On
        </Button>
        <Button containerStyle={[styles.button,{backgroundColor:'#406a98'}]} style={styles.buttonText}
          onPress={() => {
            var buffer = new Buffer('PUB hello 8' + lf + 'blue-off' + lf, 'ascii')
            this.client.write(buffer)
          }}>
          Blue Off
        </Button>

        <Button containerStyle={[styles.button,{backgroundColor:'rgb(122, 9, 33)'}]} style={styles.buttonText}
          onPress={() => {
            var buffer = new Buffer('PUB hello 6' + lf + 'red-on' + lf, 'ascii')
            this.client.write(buffer)
          }}>
          Red On
        </Button>
        <Button containerStyle={[styles.button,{backgroundColor:'rgb(125, 58, 72)'}]} style={styles.buttonText}
          onPress={() => {
            var buffer = new Buffer('PUB hello 7' + lf + 'red-off' + lf, 'ascii')
            this.client.write(buffer)
          }}>
          Red Off
        </Button>

        <Button containerStyle={[styles.button,{backgroundColor:'rgb(5, 126, 14)'}]}  style={styles.buttonText}
          onPress={() => {
            var buffer = new Buffer('PUB hello 8' + lf + 'green-on' + lf, 'ascii')
            this.client.write(buffer)
          }}>
          Green On
        </Button>
        <Button containerStyle={[styles.button,{backgroundColor:'rgb(101, 167, 106)'}]}  style={styles.buttonText}
          onPress={() => {
            var buffer = new Buffer('PUB hello 9' + lf + 'green-off' + lf, 'ascii')
            this.client.write(buffer)
          }}>
          Green Off
        </Button>

        <ScrollView
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          style={{backgroundColor:'#000',margin:10,padding:5}}>
          {this.state.chatter.map((msg, index) => {
            return (
              <Text key={index} style={styles.welcome}>
                {msg}
              </Text>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 10,
    fontFamily: 'courier',
    textAlign: 'center',
    color:'rgb(101, 230, 21)',
    fontWeight:'bold',
    textAlign:'left'
  },
  button: {backgroundColor:'#1d359d',borderRadius:10,height:30,width:100,alignItems:'center',justifyContent:'center',margin:5},
  buttonText: {color:'white',fontSize:17},
});

AppRegistry.registerComponent('NatsClient', () => NatsClient);
