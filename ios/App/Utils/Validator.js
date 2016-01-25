let React = require('react-native');

class Validator {
  constructor() {
    this.rules = {};
  }

  setRules(rules) {
      this.rules = rules;
  }

  validateData(formObj) {
    for (var i in this.rules) {
      if (formObj[i]) {
          if (this.rules[i][0](formObj[i])) {
            continue;
          }
          return { error : this.rules[i][1] };
      }
      if(typeof this.rules[i][2] != undefined && this.rules[i][2] === null) continue;
      return {error : this.rules[i][1]};
    }
    return true;
  }

  Str(x) {
    return typeof x === 'string';
  }

  Num(x) {
    return typeof x === 'number' && isFinite(x) && !isNaN(x);
  }

  Email(x) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(x);
  }

  ZipCode(x) {
    var re = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return re.test(x);
  }

  Bool(x) {
    return x === true || x === false;
  }
}

module.exports = Validator;
