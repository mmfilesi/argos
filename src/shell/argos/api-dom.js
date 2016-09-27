/**
 * @namespace Ak
 * @description Lite module for DOM manipulating
 * methods (work in progress)
 *
  *  **text()** inserta una cadena de texto en los elementos seleccionados
  *  ```javascript
    Ak('.foo').text('bazinga');
    ```

  *  **html()** inserta una cadena de html en los elementos seleccionados. Su uso es obligatorio cuando se inserta html derivado del mundo exterior de la aplicación, ya que previene la inserción de scripts.
  *  ```javascript
    Ak('.foo').html('bazinga');
    ```

  *  **hide()** oculta uno o más elementos
  * ```javascript
    Ak('.foo').hide();
    ```

  * **show()** muestra uno o más elementos
  *  ```javascript
    Ak('.foo').hide();
    ```

  *  **toggle()** togglea la visibilidad de uno o más elementos
  * ```javascript
    Ak('.foo').hide();
    ```

  *  **addClass()** añade una clase
  * ```javascript
    Ak('.foo').addClass('clase');
    ```

  *  **removeClass()** elimina una clase
  * ```javascript
    Ak('.foo').removeClass('clase');
    ```

  *  **toggleClass()** togglea una clase
  * ```javascript
    Ak('.foo').toggleClass('clase');
    ```

  *  **setStyle()** cambia un estilo (en línea)
  * ```javascript
    Ak('.foo').setStyle('color', 'red');
    ```

  *  **remove()** elimina un nodo (y sus listeners asociados)
  * ```javascript
    Ak('.foo').remove();
    ```

  *  **onRender()** chequea que un nodo esté renderizado
  * ```javascript
    Ak().onRender('#foo');
    ```
*/

(function () {

  var ArrakisDomModule = function (params) {
    var selector = document.querySelectorAll(params),
      i = 0;
    this.length = selector.length;

    for (; i < this.length; i++) {
      this[i] = selector[i];
    }

    return this;
  };

  var Ak = function (params) {
    return new ArrakisDomModule(params);
  };

  var methods = {};

  methods.self = this;

  methods.hide = function() {
    var len = this.length;

    while (len--) {
      this[len].classList.add('arrakis-hide');
    }
    return this;
  };

  methods.show = function() {
    var len = this.length;

    while (len--) {
      this[len].classList.remove('arrakis-hide');
    }
    return this;
  };

  methods.toggle = function() {
    var len = this.length;

    while (len--) {
      this[len].classList.toggle('arrakis-hide');
    }
    return this;
  };

  methods.addClass = function(classAdd) {
    var len = this.length;

    if ( classAdd ) {
      while (len--) {
        this[len].classList.add(classAdd);
      }
    }
    return this;
  };

  methods.removeClass = function(classRemove) {
    var len = this.length;

    if ( classRemove ) {
      while (len--) {
        this[len].classList.remove(classRemove);
      }
    }
    return this;
  };

  methods.toggleClass = function(classToggle) {
    var len = this.length;

    if (classToggle ) {
      while (len--) {
        this[len].classList.toggle(classToggle);
      }
    }
    return this;
  };

  methods.setStyle = function(style, value) {
    var len = this.length;

    if ( style && value ) {
      while (len--) {
        this[len].style[style] = value;
      }
    }
    return this;
  };

  methods.fade = function() {
    var len = this.length;

    while (len--) {
      this[len].classList.add('fade');
      this[len].classList.add('fade-in');
      this[len].classList.add('fade-out');
    }

    return this;
  };

  methods.text = function(text) {
    var len = this.length;

    while (len--) {
      this[len].textContent = text;
    }

    return this;
  };

  methods.html = function(content) {
    var len = this.length;

    if ( content.indexOf('script') !== -1 ) {
      content = 'scripts are not allowed';
    }

    while (len--) {
      this[len].innerHTML = content;
    }

    return this;
  };

  methods.remove = function() {
    var len = this.length;

    while (len--) {
      if ( this[len].parentNode ) {
        this[len].parentNode.removeChild(this[len]);
      }
    }
    return true;
  };

  methods.onRender = function(node) {
    var deferred = Q.defer();
    var timer = {

      interval: function() {
        var self = this;
        var timer = setTimeout(function() {
          clearTimeout(timer);
          self.init(node);
        }, 100);
      },

      init: function(node) {
        var nodeToCheck = document.querySelectorAll(node);

        if ( !nodeToCheck || nodeToCheck.length === 0 ) {
          this.interval(node);
          return;
        }
        deferred.resolve();
      }

    };

    timer.init(node);
    return deferred.promise;
  };

  methods.isEmpty = function(obj) {
    var object = obj;

    for(var prop in object) {
      if(object.hasOwnProperty(prop)){
        return false;
      }
    }

    return true;
  };

  methods.openModal = function(idModal) {
    var modal = document.getElementById(idModal);
    modal.setAttribute('show','show');
  };


  methods.closeModal = function() {
    this[0].setAttribute('show','hidden');
  };

  Ak.fn = ArrakisDomModule.prototype = methods;

  if ( !window.Ak ) {
    window.Ak = Ak;
  }

})();