import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
    ToastAndroid, Button, TouchableOpacity, Image
} from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 50,
        flexDirection: 'row',
        backgroundColor: '#f3f3f3',
        alignItems: 'center'
    },
    loader: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    loaderText: {
        textAlign: 'center',
        fontSize: 20,
        paddingBottom: 30,
    },
    textContainer: {
        flexDirection: 'column',
    },
    headerView: {
        //flex: 1
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    imageView: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
    tempText: {
        paddingLeft: 10
    },
    fab: {
        width: 45,
        height: 45,
        borderRadius: 30,
        position: 'absolute',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#76ecff',
        bottom: 10,
        right: 10,
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const API = 'http://api.openweathermap.org';
const API_KEY = '467516b940fdba088efbdb5545ae2954';
const API_IMG = API + '/img/w/';

class MainComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            weatherLoadingDone: false,
            currentLocationLat: '',
            currentLocationLong: ''
        };
        this.weatherData = {};
        this.weatherImage = '';
        this.weatherDataDate = '';
        this.weatherDataSunrise = '';
        this.weatherDataSunset = '';
    }

    getCurrentLocationAndWeatherData() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    currentLocationLat: position.coords.latitude,
                    currentLocationLong: position.coords.longitude,
                });

                fetch(API + '/data/2.5/weather?lat=' +
                    position.coords.latitude + '&lon=' +
                    position.coords.longitude + '&APPID=' + API_KEY)
                    .then(res => res.json())
                    .then(res => {

                        console.log(res);
                        this.weatherData = res;
                        this.weatherImage = API_IMG + this.weatherData.weather[0].icon + '.png';

                        let date = new Date(this.weatherData.sys.sunrise*1000);
                        let hours = date.getHours();
                        let minutes = "0" + date.getMinutes();
                        let seconds = "0" + date.getSeconds();
                        this.weatherDataSunrise = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                        date = new Date(this.weatherData.sys.sunset*1000);
                        hours = date.getHours();
                        minutes = "0" + date.getMinutes();
                        seconds = "0" + date.getSeconds();
                        this.weatherDataSunset = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                        date = new Date(this.weatherData.dt*1000);

                        hours = date.getHours();
                        minutes = "0" + date.getMinutes();
                        seconds = "0" + date.getSeconds();
                        this.weatherDataDate = hours + ':' + minutes.substr(-2) + ' ' + date.toDateString();

                        this.setState({
                            weatherLoadingDone: true
                        })
                    });

            },
            (error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    async requestLocationPermission() {

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Weather Location permission',
                    'message': 'Weather needs access to your location ' +
                    'so you can get location based weather data.'
                }
            );
            if (granted == PermissionsAndroid.RESULTS.GRANTED || granted == true){
                this.getCurrentLocationAndWeatherData();
            }
            else {
                ToastAndroid.show("Weather needs location permission to obtain your current location", ToastAndroid.SHORT);
            }
        } catch (err) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    }

    componentDidMount() {

        this.requestLocationPermission();
    }

    onPressFab() {

    }

    render() {
        if(this.state.weatherLoadingDone)
        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerText}>
                            {"Weather in"}
                        </Text>
                        <Text style={styles.headerText}>
                            {this.weatherData.name + ',' +  this.weatherData.sys.country}
                        </Text>
                    </View>
                    <View style={styles.imageView}>
                        <Image style={styles.image} source={{uri: this.weatherImage}}/>
                        <Text style={styles.tempText}>
                            {this.weatherData.main.temp - 273.15 + " °C"}
                        </Text>
                    </View>
                    <Text>
                        {this.weatherData.weather[0].main}
                    </Text>
                    <Text>
                        {this.weatherDataDate}
                    </Text>
                    <View style={styles.imageView}>
                        <Text style={styles.headerText}>
                            {"Pressure: "}
                        </Text>
                        <Text style={styles.tempText}>
                            {this.weatherData.main.pressure + ' hpa'}
                        </Text>
                    </View>
                    <View style={styles.imageView}>
                        <Text style={styles.headerText}>
                            {"Humidity: "}
                        </Text>
                        <Text style={styles.tempText}>
                            {this.weatherData.main.humidity + ' %'}
                        </Text>
                    </View>
                    <View style={styles.imageView}>
                        <Text style={styles.headerText}>
                            {"Cloudiness: "}
                        </Text>
                        <Text style={styles.tempText}>
                            {this.weatherData.weather[0].description}
                        </Text>
                    </View>
                    <View style={styles.imageView}>
                        <Text style={styles.headerText}>
                            {"Sunrise: "}
                        </Text>
                        <Text style={styles.tempText}>
                            {this.weatherDataSunrise}
                        </Text>
                    </View>
                    <View style={styles.imageView}>
                        <Text style={styles.headerText}>
                            {"Sunset: "}
                        </Text>
                        <Text style={styles.tempText}>
                            {this.weatherDataSunset}
                        </Text>
                    </View>
                    <View style={styles.imageView}>
                        <Text style={styles.headerText}>
                            {"Wind speed: "}
                        </Text>
                        <Text style={styles.tempText}>
                            {this.weatherData.wind.speed + ' m/h'}
                        </Text>
                    </View>
                    <View style={styles.imageView}>
                        <Text style={styles.headerText}>
                            {"Clouds: "}
                        </Text>
                        <Text style={styles.tempText}>
                            {this.weatherData.clouds.all + ' %'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.fab} onPress={() => this.onPressFab()}>
                    <Image source={require('./add_icon.png')}/>
                </TouchableOpacity>
            </View>
        );
        else return(
            <View style={styles.loader}>
                <Text style={styles.loaderText}>Weather info loading</Text>
                <ActivityIndicator size="large" color="#159cff" />
            </View>)
    }
}

export default MainComponent;


