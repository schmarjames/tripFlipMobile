let React = require('react-native');
let queryString = require('query-string');
let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  ListView,
  ActivityIndicatorIOS
} = React;

class WeatherData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed : false,
      weather : "",
      lat : null,
      long : null
    };
  }

  componentDidMount() {
    //this.getWeather(this.props.geoData);
    console.log(this.props.geoData);
    this.setState({lat : this.props.geoData.lat, long : this.props.geoData.long}, () => {
      this.getWeather();
    });

  }

  getWeather() {
    //http://api.openweathermap.org/data/2.5/forecast/city?id=524901&APPID={APIKEY}
    var url = "api.openweathermap.org/data/2.5/weather?lat=" + this.state.lat + "&lon=" + this.state.long + "&APPID=dc917ecc31f3df833231b3804d609fed";

    fetch(url)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        this.setState({displayed : true, weather : "got the weather" });
      });
  }

  render() {
    var weatherView = <ActivityIndicatorIOS
          animating={this.state.showProgress}
          size="small" />;

    if (this.state.displayed) {
      weatherView = this.state.weather;
    }

    return (
      <View>
        { weatherView }
      </View>
    );
  }
}

module.exports = WeatherData;
