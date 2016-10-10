'use strict';

/* OJO: el controlador debe llamarse como el archivo pasado a camelCase.
  por ejemplo, si el archivo se llama bar-controller, el controlador debe
  denominarse barController.
  Otro caso: si el controlador es getCustomersController, el archivo debe ser
  get-customers-controller */

(function (window) {
  'use strict';

  /**
   * @namespace mainController
   * @description
   */

  var mainController = function () {

    var module = {};
    var self = module;

    module.init = function () {
      log.success('main controller :: init');
      self.loadTemplate();

      var miObjeto = {};
      var miPropiedad = Symbol("miSimbolo");
      miObjeto[miPropiedad] = 'foo';

      console.log(miObjeto);
    };

    module.loadTemplate = function () {
      var data = self.prepareData();
      var source = 'js-main-template';
      var container = 'argos-main-stage';

      viewsUtils.renderTemplate(data, source, container);
      self.postRender();
      self.removeListeners();
      self.addListeners();
    };

    module.prepareData = function () {
      var allData = {};
      var texts = globals.getTexts();

      allData.texts = {};
      allData.texts.ok = texts.ok;

      return allData;
    };

    module.postRender = function () {
      Ar('#test').html('<p>api dom works</p>').setStyle('color', 'red');
    };

    module.removeListeners = function () {};

    module.addListeners = function () {
      document.getElementById('js-buttonFoo').onclick = function () {
        router.stateGo('foo');
      };

      document.getElementById('myFormSubmit').addEventListener('click', self.submitForm, true);
    };

    module.submitForm = function (e) {
      var values = forms.getValues('myForm');

      forms.isValid('myForm');

      e.preventDefault();
      console.log('v', values);
    };

    return {
      init: module.init,
      testBind: module.testBind
    };
  }();

  /* "exportar" solo el contenido que se maneje desde fuera
  del falso módulo */
  window['mainController'] = mainController;
})(window);