/*eslint-disable no-unused-vars*/
var utils = {
  /*eslint-enable no-unused-vars*/

  viewPort: function() {
    var isAndroid = navigator.userAgent.match(/Android/i) !== null,
      isiOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) !== null,
      isFirefox = navigator.userAgent.match(/Firefox/i) !== null,
      isMobile = isiOS || isAndroid;

    var getNavigator = {
      'isAndroid': isAndroid,
      'isiOS': isiOS,
      'isMobile': isMobile,
      'isFirefox': isFirefox
    };
    return getNavigator;
  },

  validationMessage: function(e) {
    var state = this.validity;

    if (this.validity.valueMissing) {
      e.target.setCustomValidity(allTexts.validationText.required);
    } else if (this.validity.patternMismatch) {
      e.target.setCustomValidity(allTexts.validationText.pattern);
    } else {
      e.target.setCustomValidity('');
    }
  }

};