/* OJO: el controlador debe llamarse como el archivo pasado a camelCase.
  por ejemplo, si el archivo se llama bar-controller, el controlador debe
  denominarse barController.
  Otro caso: si el controlador es getCustomersController, el archivo debe ser
  get-customers-controller */

(function(window) {
  'use strict';

  /**
   * @namespace mainController
   * @description
   */
  const mainController  = (function() {

    const module    = {};
    const self      = module;

    module.init = ()=> {
      log.success('main controller :: init');
      self.loadTemplate();

      let miObjeto = {}
      let miPropiedad = Symbol("miSimbolo");
      miObjeto[miPropiedad] = 'foo';

      console.log(miObjeto)
    };

    module.loadTemplate = ()=> {
      let data      = self.prepareData();
      let source    = 'js-main-template';
      let container = 'argos-main-stage';

      viewsUtils.renderTemplate(data, source, container);
      self.postRender();
      self.removeListeners();
      self.addListeners();
    };

    module.prepareData = ()=> {
      let allData = {};
      let texts   = globals.getTexts();

      allData.texts     = {};
      allData.texts.ok  = texts.ok;

      return allData;
    };

    module.postRender = ()=> {
      Ar('#test').html('<p>api dom works</p>').setStyle('color', 'red');
    };

    module.removeListeners = ()=> {
    };

    module.addListeners = ()=> {
      document.getElementById('js-buttonFoo').onclick = ()=>{
        router.stateGo('foo');
      }

      document.getElementById('myFormSubmit').addEventListener('click', self.submitForm, true);
    };

    module.submitForm = (e)=> {
      const values = forms.getValues('myForm');

      forms.isValid('myForm');

      e.preventDefault();
      console.log('v', values);
    };

    return {
      init: module.init,
      testBind: module.testBind
    };

  })();

  /* "exportar" solo el contenido que se maneje desde fuera
  del falso módulo */
  window['mainController'] = mainController;
})(window);
