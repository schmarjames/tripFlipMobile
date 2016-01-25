var React = require('react-native');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#E4e4e4',
    padding: 0,
    alignSelf: 'stretch'
  }
});

class Separator extends React.Component {
  render() {
    return (
      <View style={styles.separator} />
    )
  }
}

module.exports = Separator;
