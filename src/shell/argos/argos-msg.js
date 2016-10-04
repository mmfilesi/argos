'use strict';

/**
 * @namespace msg
 * @description
 */
const msg = (function() {

  const module    = {};
  const self      = module;

  module._lastClass = '';

  module.showError = (header, body)=> {
    self._showMsg('alert', header, body);
  };

  module.showWarning = (header, body)=> {
    self._showMsg('warning', header, body);
  };

  module.showSuccess = (header, body)=> {
    self._showMsg('success', header, body);
  };

  module.showErrorServer = (error)=> {
    self._showMsg.showMsg('alert', 'server error', error);
    // todo : bloquear la aplicación
  };

  module.showMsg = (type, header, body)=> {
    let msgElement  = document.getElementById('argos-msg');
    let msgHeader   = header || '';
    let msgBody     = body || '';

    if ( self._lastClass ) {
      msgElement.classList.remove(self._lastClass);
    }
    self._lastClass = type;
    msgElement.classList.add(type);

    document.getElementById('argos-msg-header').textContent = msgHeader;
    document.getElementById('argos-msg-body').textContent = msgBody;

    msgElement.classList.add('argos-fade-out');
    msgElement.classList.remove('argos-hide');
    msgElement.classList.add('argos-fade-in');
  };

  return {
    showError:          module.showError,
    showWarning:        module.showWarning,
    showSuccess:        module.showSuccess,
    showErrorServer:    module.showErrorServer
  };

})();

