let React = require('react-native');
let AsyncStorage = require('react-native').AsyncStorage;
let AutoComplete = require('react-native-autocomplete');
let General = require('../Styles/General');
let BlurView = require('react-native-blur').BlurView;

let {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Animated,
  LayoutAnimation,
  AlertIOS,
  Image,
  processColor,
  Dimensions
} = React;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options : null,
      searchViewOpacity : new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.spring(
      this.state.searchViewOpacity,
      {
        toValue: 1
      }
    ).start();
  }

  onTyping(text) {

    if (this.props.searchType == 'allcountries') {
      var options = this.props.searchOptions.filter((option) =>
          option.name.toLowerCase().startsWith(text.toLowerCase())
        ).map((option) => option.name);
      this.setState({options : options});
      return;
    }

    if (this.props.searchType == 'specificCountries') {
      var options = this.props.searchOptions.filter((option) => {

        if (option.cityName.toLowerCase().startsWith(text.toLowerCase()) || option.stateRegionName.toLowerCase().startsWith(text.toLowerCase())) {
          return option;
        }
      })
      .map((option) => {
        var stateRegion = option.stateRegionName.toLowerCase(),
            city = option.cityName.toLowerCase();

        if (city.startsWith(text.toLowerCase()) && !stateRegion.startsWith(text.toLowerCase())) {
          return option.cityName + ", " + option.stateRegionName;
        }

        if (!city.startsWith(text.toLowerCase()) && stateRegion.startsWith(text.toLowerCase())) {
          return option.stateRegionName;
        }

        if (city.startsWith(text.toLowerCase()) && stateRegion.startsWith(text.toLowerCase())) {
          return option.cityName;
        }
      });

      this.setState({options : options});
      return;
    }

    if (this.props.searchType == 'allLocations') {
      var options = this.props.searchOptions.filter((option) => {
        console.log('allLocations');
        console.log(option);
        if (option.cityName.toLowerCase().startsWith(text.toLowerCase()) ||
            option.stateRegionName.toLowerCase().startsWith(text.toLowerCase()) ||
            option.countryName.toLowerCase().startsWith(text.toLowerCase())) {
          return option;
        }
      })
      .map((option) => {
        var stateRegion = option.stateRegionName.toLowerCase(),
            city = option.cityName.toLowerCase(),
            country = option.countryName.toLowerCase();

        if (country.startsWith(text.toLowerCase())) {
          return option.countryName;
        }

        if (city.startsWith(text.toLowerCase()) && !stateRegion.startsWith(text.toLowerCase())) {
          return option.cityName + ", " + option.stateRegionName;
        }

        if (!city.startsWith(text.toLowerCase()) && stateRegion.startsWith(text.toLowerCase())) {
          return option.stateRegionName;
        }

        if (city.startsWith(text.toLowerCase()) && stateRegion.startsWith(text.toLowerCase())) {
          return option.cityName;
        }
      });
      this.setState({options : options});
      return;
    }

  }

  prepareSearch(text) {
    if (this.props.searchType == 'allcountries') {
      var needle = this.props.searchOptions.filter((option) => {
        if (option.name.toLowerCase() == text.toLowerCase()) {
          return option;
        }
      })[0];
    }

    else if (this.props.searchType == 'specificCountries') {
      var needle = this.props.searchOptions.filter((option) => {
        var stateRegion = option.stateRegionName.toLowerCase(),
            city = option.cityName.toLowerCase();

        if (stateRegion == text.toLowerCase()) {
          option.chosenProp = "stateRegionId";
          return option;
        }

        if (text.toLowerCase().indexOf(city) > -1 || text.toLowerCase().indexOf(stateRegion) > -1) {
          option.chosenProp = "cityId";
          return option;
        }
      })
      .map((option) => {
        var stateRegion = option.stateRegionName.toLowerCase(),
            city = option.cityName.toLowerCase();

        if (stateRegion == text.toLowerCase()) {
          option.chosenProp = "stateRegionId";
        }

        if (text.toLowerCase().indexOf(city) > -1 || text.toLowerCase().indexOf(stateRegion) > -1) {
          option.chosenProp = "cityId";
        }

        return option;
      })[0];
    }

    else if (this.props.searchType == 'allLocations') {
      var needle = this.props.searchOptions.filter((option) => {
        var stateRegion = option.stateRegionName.toLowerCase(),
            city = option.cityName.toLowerCase(),
            country = option.countryName.toLowerCase();

        if (country == text.toLowerCase()) {
          return option;
        }

        if (stateRegion == text.toLowerCase()) {
          return option;
        }

        if (text.toLowerCase().indexOf(city) > -1 || text.toLowerCase().indexOf(stateRegion) > -1) {
          return option;
        }
      })
      .map((option) => {
        var stateRegion = option.stateRegionName.toLowerCase(),
            city = option.cityName.toLowerCase(),
            country = option.countryName.toLowerCase();

        if (country == text.toLowerCase()) {
          option.chosenProp = "countryId";
        }

        if (stateRegion == text.toLowerCase()) {
          option.chosenProp = "stateRegionId";
        }

        if (text.toLowerCase().indexOf(city) > -1 || text.toLowerCase().indexOf(stateRegion) > -1) {
          option.chosenProp = "cityId";
        }

        return option;
      })[0];
    }

    if (needle !== undefined) {
      this.props.getSearchedData(needle);
    }
  }

  render() {
    return (
      <Animated.View style={[styles.container]}>
        <BlurView blurType="dark"
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: processColor('rgba(0,0,0,0.3)'),
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              height : Dimensions.get('window').height,
              width : Dimensions.get('window').width
            }}
        />
      <View style={{flex : 1, flexDirection: 'row', marginTop : Dimensions.get('window').height / 10}}>
          <View style={{flex : 8}}>
            <AutoComplete
                autoFocus={true}
                onTyping={this.onTyping.bind(this)}
                onSelect={(e) => this.prepareSearch(e)}
                onBlur={() => console.log('Blur')}
                onFocus={() => console.log('Focus')}
                onSubmitEditing={(e) => this.prepareSearch(e.nativeEvent.text)}
                onEndEditing={(e) => console.log('onEndEditing')}

                suggestions={this.state.options}

                placeholder='Search for a location'
                style={styles.autocomplete}
                clearButtonMode='always'
                returnKeyType='search'
                textAlign='center'
                clearTextOnFocus={true}

                maximumNumberOfAutoCompleteRows={10}
                applyBoldEffectToAutoCompleteSuggestions={true}
                reverseAutoCompleteSuggestionsBoldEffect={true}
                showTextFieldDropShadowWhenAutoCompleteTableIsOpen={false}
                autoCompleteTableViewHidden={false}

                autoCompleteTableBorderColor={'#000'}
                autoCompleteTableBackgroundColor={'#000'}
                autoCompleteTableCornerRadius={10}
                autoCompleteTableBorderWidth={1}

                autoCompleteRowHeight={35}

                autoCompleteFontSize={15}
                autoCompleteRegularFontName='Helvetica Neue'
                autoCompleteBoldFontName='Helvetica Bold'
                autoCompleteTableCellTextColor={'#ffffff'}
            />
          </View>
          <View style={{flex : 2, width : Dimensions.width / 6, justifyContent : 'center'}}>
            <TouchableHighlight
              onPress={() => {
                this.props.closeSearch();
              }}
              underlayColor="white">
              <Text style={styles.cancel}>CANCEL</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Animated.View>
    );
  }
}

var styles = StyleSheet.create({
    autocomplete: {
        alignSelf: 'stretch',
        height: 50,
        backgroundColor: '#cdcdcd',
        borderRadius : 5
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding : 5,
        position : 'absolute',
        top : 0,
        left : 0,
        right : 0,
        bottom : 0
    },
    welcome: {
        flex : 2,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 50
    },
    cancel : {
      color : '#ffffff',
      alignSelf : 'center',
      marginTop : 10
    }
});

module.exports = Search;
