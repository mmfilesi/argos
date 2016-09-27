/*eslint-disable no-unused-vars*/
var msg = ( function() {
/*eslint-enable no-unused-vars*/

  var module = {

    destroyMsg: function(idMsg) {
      var id = '#'+idMsg;
      var timer = setTimeout(function() {
        Ak(id).remove();
        window.clearTimeout(timer);
      }, 5000);
    },

    showMsg: function(type, header, body) {
      var msgElement = document.createElement('san-notification');
      var idMsg = "msg-"+Date.now();
      var timer;

      header = header || '';
      body = body || '';

      msgElement.setAttribute('show', 'hidden');
      msgElement.setAttribute('header', header);
      msgElement.setAttribute('body', body);
      msgElement.setAttribute('type', type);
      msgElement.setAttribute('id', idMsg);
      document.body.appendChild(msgElement);

      timer = setTimeout(function() {
        msgElement.setAttribute('show', 'show');
        window.clearTimeout(timer);
      }, 100);

      if ( type !== 'alert' ) {
        module.destroyMsg(idMsg);
      }

    },

    showError: function(header, body) {
      module.showMsg('alert', header, body);
    },

    showWarning: function(header, body) {
      module.showMsg('warning', header, body);
    },

    showSuccess: function(header, body) {
      module.showMsg('success', header, body);
    },

    showErrorServer: function(error) {
      module.showMsg('alert', 'server error', error);
      if ( document.getElementById('js-mainPreload') ) {
        document.getElementById('js-mainPreload').setAttribute('show', 'hidden');
      }
    },

    showWarningModal: function(msg) {
      $('#msgModal').find('.js-msgModalSuccess').hide(300);
      $('#msgModal').find('.js-msgModalError').show(300);
      $('#js-msgModalBody').html(msg);
      $('#msgModal').addClass('warning').show();
    },

    showSuccessModal: function(msg) {
      $('#msgModal').find('.js-msgModalSuccess').show(300);
      $('#msgModal').find('.js-msgModalError').hide(300);
      $('#msgModal').addClass('success').show();

    },
  };

  return {
    showError: module.showError,
    showWarning: module.showWarning,
    showSuccess: module.showSuccess,
    showErrorServer: module.showErrorServer,
    showWarningModal: module.showWarningModal,
    showSuccessModal: module.showSuccessModal
  };

} )();