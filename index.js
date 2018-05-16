import React, { Component } from 'react';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View,
    YellowBox
} from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

import MainComponent from './app/components/MainComponent';
import WeatherInfo from "./app/components/WeatherInfo";

import {
    createStackNavigator,
} from 'react-navigation';

const App = createStackNavigator({
    Home: { screen: MainComponent},
    WeatherInfo: { screen: WeatherInfo },
});

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
