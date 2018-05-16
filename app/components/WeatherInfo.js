import React, { Component } from 'react';
import {
    ActivityIndicator,
    AppRegistry, Image,
    Platform,
    StyleSheet,
    Text,
    View,
    ToastAndroid
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const API = 'http://api.openweathermap.org';
const API_KEY = '467516b940fdba088efbdb5545ae2954';
const API_IMG = API + '/img/w/';

class WeatherInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            isCitySelected: false,
            weatherDataLoadingDone: false
        };

        this.weatherData = {};
        this.weatherImage = '';
        this.weatherDataDate = '';
        this.weatherDataSunrise = '';
        this.weatherDataSunset = '';
    }

    static navigationOptions = {
        title: 'Weather'
    };

    onSelectCity(city) {
        this.setState({
            cityName: city,
            isCitySelected: true
        });

        fetch(API + '/data/2.5/weather?q=' + city + '&APPID=' + API_KEY)
            .then(res => res.json())
            .then(res => {

                console.log(res);
                if(res.cod == 200) {
                    this.weatherData = res;
                    this.weatherImage = API_IMG + this.weatherData.weather[0].icon + '.png';

                    let date = new Date(this.weatherData.sys.sunrise * 1000);
                    let hours = date.getHours();
                    let minutes = "0" + date.getMinutes();
                    let seconds = "0" + date.getSeconds();
                    this.weatherDataSunrise = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                    date = new Date(this.weatherData.sys.sunset * 1000);
                    hours = date.getHours();
                    minutes = "0" + date.getMinutes();
                    seconds = "0" + date.getSeconds();
                    this.weatherDataSunset = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                    date = new Date(this.weatherData.dt * 1000);

                    hours = date.getHours();
                    minutes = "0" + date.getMinutes();
                    seconds = "0" + date.getSeconds();
                    this.weatherDataDate = hours + ':' + minutes.substr(-2) + ' ' + date.toDateString();

                    this.setState({
                        weatherDataLoadingDone: true
                    })
                }else {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                    this.setState({
                        isCitySelected: false
                    })
                }
            }).catch((error) => {
                console.log(error.message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isCitySelected && !this.state.weatherDataLoadingDone ?
                    <View style={styles.loader}>
                        <Text style={styles.loaderText}>Weather info loading</Text>
                        <ActivityIndicator size="large" color="#159cff" />
                    </View> : <View/>}

                {this.state.weatherDataLoadingDone ? <View style={styles.textContainer}>
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
                </View> : <View/>}

                <GooglePlacesAutocomplete
                    placeholder='Enter your city name to get weather info'
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed='auto'    // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        console.log(data, details.name);
                        this.onSelectCity(details.name);
                    }}

                    getDefaultValue={() => ''}

                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyCESkqrMMRbRtr1Acm4FTeUnDT_RaXrrtM',
                        language: 'en', // language of the results
                        types: '(cities)' // default: 'geocode'
                    }}

                    styles={{
                        container: {
                            width: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: '#f3f3f3'
                        },
                        textInputContainer: {
                            width: '100%'
                        },
                        description: {
                            fontWeight: 'bold'
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        }
                    }}

                    currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Current location"
                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                        types: 'food'
                    }}

                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f3f3f3',
        alignItems: 'center',
        justifyContent: 'center',
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
});

export default WeatherInfo;
