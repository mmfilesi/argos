/**
 * @namespace animations
 * @description Module for work with animations (css)
 */

/*eslint-disable no-unused-vars*/
var animations = (function() {
/*eslint-enable no-unused-vars*/

  var module = {

    /**
    * @memberof animations#
    * @name classToClass
    * @param {string} idContainer id node to animate
    * @param {string} content content to insert in node
    * @param {string} classApply class to apply
    * @return {undefined}
    * @description (private) add class && and remove class
    */
    classToClass: function(idContainer, content, classApply) {
      var container = document.getElementById(idContainer);

      if ( !container ) {
        return false;
      }

      container.classList.add('arrakis-'+classApply+'-out');
      container.classList.add('arrakis-fade');
      container.innerHTML = content;
      return true;
    },

    /**
    * @memberof animations#
    * @name fadeIn
    * @param {string} idContainer id node to animate
    * @param {string} content content to insert in node
    * @return {undefined}
    * @description show content with fade transitions
    * @example
    * $('#foo').fadeIn('<h4>Bazinga</h4>');
    */
    fadeIn: function(idContainer, content) {
      this.classToClass(idContainer, content, 'fade');
    }

  };

  return {
    fadeIn: module.fadeIn
  };

} )();