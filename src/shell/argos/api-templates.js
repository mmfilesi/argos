/**
 * @namespace api-templates
 * @description Module for load and manipulate handlebars templates
*/

/*eslint-disable no-unused-vars*/
var apiTemplates = {
/*eslint-enable no-unused-vars*/

  /**
    * @memberof api-templates#
    * @name load
    * @param {string} templatePath path's template
    * @return {undefined}
    * @description load template(s)
  */
  load: function(templatePath) {
    var req = new XMLHttpRequest();

    req.open('GET', templatePath, true);

    req.onreadystatechange = function() {
      var template;
      if (req.readyState === 4 && req.status === 200) {
        template = document.createElement('div');
        template.innerHTML = req.responseText;
        document.getElementById('js-templates-container').appendChild(template);
      }
    };

    req.send();
  }

};