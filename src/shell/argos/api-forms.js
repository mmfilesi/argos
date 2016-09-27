/*eslint-disable no-unused-vars*/
var forms = ( function() {
/*eslint-enable no-unused-vars*/

  var module = {};
  var self = module;

  module.resetErrors = function(idForm) {
    $(idForm + ' .hasError').removeClass('hasError');
    $(idForm + ' .form__error').remove();
  };

  module.addErrorMsg = function(msg) {
    var stringHTML = '';

    stringHTML += '<div class=\'form__error\'><div class=\'form__error__arrow\'></div>';
    stringHTML += msg + '</div></div>';

    return stringHTML;
  };

  module.addError = function(node, errorType) {
    var errorString = '';

    switch (errorType) {
    case 'notEmail':
    case 'notString':
    case 'notNumber':
      errorString = allTexts.validationText.pattern;
      break;
    default:
      errorString = allTexts.validationText.required;
    }
    $(node).after( self.addErrorMsg(errorString) );
    $(node).addClass('hasError');
  };

  module.checkRequired = function(node) {
    var isValid = true;

    if ($(node).attr('data-required') && !self.getValue(node)) {
      isValid = false;
      self.addError(node, 'required');
    }
    return isValid;
  };

  module.checkIsNumber = function(node) {
    var isValid     = true;
    var rule        = /^[0-9]*$/g;
    var value       = $(node).val();

    if ( !rule.test(value) ) {
      isValid = false;
      self.addError(node, 'notNumber');
    }

    if ( $(node).attr('data-zero') && $(node).attr('data-zero') === 'notAllowed' && $(node).val() === 0 ) {
      self.addError(node, 'notNumber');
      isValid = false;
    }

    if ( $(node).attr('data-negative') && $(node).attr('data-negative') === 'notAllowed' && $(node).val() < 0 ) {
      self.addError(node, 'notNumber');
      isValid = false;
    }

    return isValid;
  };

  module.checkIsEmail = function(node) {
    var isValid     = true;
    var rule        = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/;
    var value       = $(node).val();

    if ( !rule.test(value) ) {
        isValid = false;
        self.addError(node, 'notEmail');
    }

    return isValid;
    
  };

  module.checkType = function(node) {
    var type =  $(node).attr('data-type');

    switch(type) {
      case 'isNumber':
        return self.checkIsNumber(node);
      case 'isString':
        return self.checkIsString(node);
      case 'isEmail':
      default:
        return true;
    }   
  
  };

  module.checkIsString = function(node) {
    var isValid = true;
    
    rules.isString = /[1-9]/i;
    if ( !rule.test(value) ) {
      isValid = false;
      self.addError(node, 'notString');
    }
    return isValid;
  };

  module.checkSpecialValidation = function(node) {
    var isValid = true;
    return isValid;
  };

  module.isValid = function(idForm) {
    var nodes = $(idForm + ' .js-itemForm');
    var isValid = true;

    self.resetErrors(idForm);
    nodes.each(function() {
      if (!self.checkRequired(this) || !self.checkType(this) || !self.checkSpecialValidation(this)) {
        isValid = false;
      }
    });
    return isValid;
  };

  module.getValue = function(node) {
    var value = null;

    if ($(node).is(':checkbox')) {
      return $(node).prop('checked');
    }
    return $(node).val();
  };

  module.setEnabled = function(node, enab) {
    $(node).attr('disabled', enab);
  };

  module.enabled = function(node) {
    self.setEnabled(node, false);
  };

  module.disabled = function(node) {
    self.setEnabled(node, true);
  };

  module.setRequired = function(node, req) {
    if (!req) {
      $(node).attr('data-required', false);
    } else {
      $(node).attr('data-required', 'isRequired');
    }
  };

  module.required = function(node) {
    self.setRequired(node, true);
  };

  module.notRequired = function(node) {
    self.setRequired(node, false);
  };

  module.getValues = function(idForm) {
    var nodes = $(idForm + ' .js-itemForm');
    var jsonForm = {};
    nodes.each(function() {
      var key = $(this).attr('data-key') || $(this).attr('id') || 'withoutKey';
      var value = self.getValue(this);
      jsonForm[key] = value;
    });
    return jsonForm;
  };

  module.getErrorWarning = function(data) {

    var errorMsg = allTexts.restErrors.generic;

    if ( data.hasOwnProperty('result') && data.result.message ) {
      errorMsg = data.result.message;
    }
    return errorMsg;
  };

  module.isValidResponse = function(data) {
    var isValid = true;
    var len;
    var errors = data.errors;

    if ( Array.isArray(errors) && errors.length ) {
      isValid = false;
      len     = errors.length;
      while(len--) {
        $('#'+errors[len].field).after( self.addErrorMsg(errors[len].defaultMessage) );
        $('#'+errors[len].field).addClass('hasError');
      }
    }

    if ( data.hasOwnProperty('result') && data.result.code !== restUtils.codes.success ) {
      isValid = false;
    }
    return isValid;
  };

  return {
    isValid:            module.isValid,
    enabled:            module.enabled,
    disabled:           module.disabled,
    required:           module.required,
    notRequired:        module.notRequired,
    getValues:          module.getValues,
    getErrorWarning:    module.getErrorWarning,
    isValidResponse:    module.isValidResponse
  };

} )();