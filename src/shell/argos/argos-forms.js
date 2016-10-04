'use strict';

/**
 * @namespace forms
 * @description module for work with forms.
 * todo: show error server
 */
const forms = (function() {

  const module    = {};
  const self      = module;

  /* ====================================================
      get values
  ==================================================== */

  /**
  * @memberof forms#
  * @method
  * @name getValues
  * @param {string} idForm - The id of the form.
  * @return {object} All form childrens values.
  * @description return pair key-value for each input.
  * The inputs need have the class 'js-itemForm' and, recommended, an atribute called 'data-key'.
  * @example:
  *  ```html
    <input type="text" name="inputText" class="js-itemForm" data-key="inputText">
    ```
  */
  module.getValues = (idForm)=> {
    let nodes       = document.querySelectorAll('#'+idForm + ' .js-itemForm');
    let jsonForm    = {};
    let i           = 0;
    let len         = nodes.length;
    let key         = '';
    let value       = '';
    /* guardamos aquí los radioButtons para no setearlos más de una vez */
    let radioInputs = [];

    if ( !len ) {
      log.warning('the form dont have inputs or mybe forget add js-itemForm class?');
    }

    for (; i<len; i++) {
      if ( nodes[i].type.toLowerCase() !== 'radio' || radioInputs.indexOf(nodes[i].name) === -1 ) {
        key   = nodes[i].getAttribute('data-key') || nodes[i].name || i;
        value = self.getValue(nodes[i]);
        jsonForm[key] = value;
        if ( nodes[i].type.toLowerCase() === 'radio' ) {
          radioInputs.push(nodes[i].name);
        }
      }
    }

    return jsonForm;
  };

  /**
  * @memberof forms#
  * @method
  * @name getValue
  * @param {(string | object} _node_ - The id element or the element of form.
  * @return {string |array} The form element value.
  */
  module.getValue = (_node_)=> {
    let node     = typeof _node_ === 'string' ? document.getElementById(idNode) : _node_;
    let value    = '';
    let type     = '';

    if ( !node ) {
      log.warning('getValue() :: there is no element');
    }

    type = node.tagName.toLowerCase() !== 'input' ? node.tagName.toLowerCase() : node.type.toLowerCase();
    type = type === 'select' && node.type === 'select-multiple' ? 'select-multiple' : type;

    switch (type) {
      case 'text':
      case 'textarea':
      case 'number':
        value = node.value.trim();
        break;
      case 'checkbox':
        value = node.checked ? node.value : false;
        break;
      case 'radio':
        value = document.querySelector('input[name = "' + node.name + '"]:checked').value;
        break;
      case 'select-multiple':
        value = self._getMultiSelectValues(node);
        break;
      default:
        value = node.value;
    }

    return value;
  };

  /**
  * @memberof forms#
  * @method
  * @name _getMultiSelectValues
  * @param {object} _node_ - The element multi-select of form.
  * @return {array} The multi-select value.
  */
  module._getMultiSelectValues = (node)=> {
    let selectedValues = [];
    let i = 0;
    let len = node.length;

    for (; i < len; i++) {
      if (node.options[i].selected) {
        selectedValues.push(node.options[i].value);
      }
    }
    return selectedValues;
  };

  /* ====================================================
      utils
  ==================================================== */

  module.enabled = (idNode)=> {
    self._setEnabled(idNode, false);
  };

  module.disabled = (idNode)=> {
    self._setEnabled(idNode, true);
  };

  module._setEnabled = (idNode, enab)=> {
    document.getElementById(idNode).setAttribute('disabled', enab);
  };

  module.required = (idNode)=> {
    self._setRequired(idNode, 'required');
  };

  module.notRequired = (idNode)=> {
    self._setRequired(idNode, false);
  };

  module._setRequired = (idNode, req)=> {
    document.getElementById(idNode).setAttribute('data-required', req);
  };

  /* ====================================================
      validity checks
  ==================================================== */

  module.isValid = (idForm)=> {
    let nodes       = document.querySelectorAll('#'+idForm + ' .js-itemForm');
    let i           = 0;
    let len         = nodes.length;
    let isValid     = true;

    if ( !len ) {
      log.warning('the form dont have inputs or mybe forget add js-itemForm class?');
    }

    self.resetErrors(idForm);

    for (; i<len; i++) {
      if ( !self.checkRequired(nodes[i]) || !self.checkType(nodes[i]) || !self.customValidation(nodes[i]) ) {
        isValid = false;
      }
    }
    return isValid;
  };

  /* No le paso los nodos para que se pueda usar como método de forma independiente */
  module.resetErrors = (idForm)=> {
    let nodes = document.querySelectorAll('#'+idForm + ' .js-itemForm');
    let i     = 0;
    let len   = nodes.length;

    for (; i<len; i++) {
      nodes[i].classList.remove('hasError');
    }

    nodes = document.querySelectorAll('#'+idForm + ' .js-argosErrorMsg');
    i     = 0;
    len   = nodes.length;

    for (; i<len; i++) {
     nodes[i].parentNode.removeChild(nodes[i]);
    }
  };

  module.checkRequired = (node)=> {
    let isValid = true;

    if ( node.getAttribute('data-required') === 'required' && !self.getValue(node) ) {
      isValid = false;
      self.addError(node, 'required');
    }
    return isValid;
  };

  module.checkType = (node)=> {
    let type =  node.getAttribute('data-type');

    switch(type) {
      case 'isNumber':
        return self._checkIsNumber(node);
      case 'isString':
        return self._checkIsString(node);
      case 'isEmail':
      return self._checkIsEmail(node);
      default:
        return true;
    }
  };

  module._checkIsString = (node)=> {
    let isValid = true;
    let rule    = /[1-9]/i;
    let value   = self.getValue(node);

    if ( !rule.test(value) ) {
      isValid = false;
      self.addError(node, 'notString');
    }
    return isValid;
  };

  module._checkIsNumber = (node)=> {
    let isValid = true;
    let rule    = /^[0-9]*$/g;
    let value   = self.getValue(node);

    if ( !rule.test(value) ) {
      isValid = false;
      self.addError(node, 'notNumber');
    }

    if ( node.getAttribute('data-zero') && node.getAttribute('data-zero') === 'notAllowed' && value === 0 ) {
      self.addError(node, 'notZero');
      isValid = false;
    }

    if ( node.getAttribute('data-negative') && node.getAttribute('data-negative') === 'notAllowed' && value < 0 ) {
      self.addError(node, 'notNegative');
      isValid = false;
    }

    return isValid;
  };

  module._checkIsEmail = (node)=> {
    let isValid = true;
    let rule    = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/;
    let value   = self.getValue(node);

    if ( !rule.test(value) ) {
        isValid = false;
        self.addError(node, 'notEmail');
    }

    return isValid;
  };

  module.customValidation = (node)=> {
    let isValid = true;
    let rule    = node.getAttribute('data-regex') ? new RegExp(node.getAttribute('data-regex'), 'i') : false;
    let value   = self.getValue(node);

    if ( !rule ) {
      return isValid;
    }

    if ( !rule.test(value) ) {
      isValid = false;
      self.addError(node, node.getAttribute('data-regexErrMsg') || 'wrongFormat');
    }

    return isValid;
  };

  /* todo: ampliar tipología de errores */
  module.addError = (node, errorType)=> {
    let errorString = '';

    switch (errorType) {
      case 'required':
        errorString = globals.getTexts().formValidations.isRequired;
        break;
      default:
        errorString = globals.getTexts().formValidations.wrongFormat;
    }
    node.insertAdjacentHTML('afterend', self.addErrorMsg(errorString));
    node.classList.add('hasError');
  };

  module.addErrorMsg = (msg)=> {
    let stringHTML = `<div class="form__error js-argosErrorMsg"><div class="form__error__arrow"></div>${msg}</div></div>`;

    return stringHTML;
  };

  return {
    getValues:          module.getValues,
    getValue:           module.getValue,
    disabled:           module.disabled,
    enabled:            module.enabled,
    required:           module.required,
    notRequired:        module.notRequired,
    isValid:            module.isValid,
    checkRequired:      module.checkRequired,
    checkType:          module.checkType,
    customValidation:   module.customValidation,
    addError:           module.addError,
    addErrorMsg:        module.addErrorMsg
  };

})();
