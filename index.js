import React, { Component } from 'react';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import MainComponent from './app/components/MainComponent';


class App extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <MainComponent/>
                <Text style={styles.title}>
                    Weather
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        position: 'absolute',
        textAlign: 'center',
        justifyContent: 'center',
        lineHeight: 40,
        alignContent: 'center',
        backgroundColor: '#159cff',
        color: '#ffffff',
        width: '100%',
        height: 40,
        fontSize: 24,
        fontWeight: 'bold'
    },
});


AppRegistry.registerComponent('Weather', () => App);
