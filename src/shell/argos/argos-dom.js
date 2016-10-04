/**
 * @namespace Ar
 * @description Lite module for DOM manipulating
 * methods (work in progress)
 *
  *  **text()** inserta una cadena de texto en los elementos seleccionados
  *  ```javascript
    Ar('.foo').text('bazinga');
    ```

  *  **html()** inserta una cadena de html en los elementos seleccionados. Su uso es obligatorio cuando se inserta html derivado del mundo exterior de la aplicación, ya que previene la inserción de scripts.
  *  ```javascript
    Ar('.foo').html('bazinga');
    ```

  *  **hide()** oculta uno o más elementos
  * ```javascript
    Ar('.foo').hide();
    ```

  * **show()** muestra uno o más elementos
  *  ```javascript
    Ar('.foo').hide();
    ```

  *  **toggle()** togglea la visibilidad de uno o más elementos
  * ```javascript
    Ar('.foo').hide();
    ```

  *  **addClass()** añade una clase
  * ```javascript
    Ar('.foo').addClass('clase');
    ```

  *  **removeClass()** elimina una clase
  * ```javascript
    Ar('.foo').removeClass('clase');
    ```

  *  **toggleClass()** togglea una clase
  * ```javascript
    Ar('.foo').toggleClass('clase');
    ```

  *  **setStyle()** cambia un estilo (en línea)
  * ```javascript
    Ar('.foo').setStyle('color', 'red');
    ```

  *  **remove()** elimina un nodo (y sus listeners asociados)
  * ```javascript
    Ar('.foo').remove();
    ```

  *  **onRender()** chequea que un nodo esté renderizado
  * ```javascript
    Ar().onRender('#foo');
    ```
*/

(function () {

  const argosDom = function (params) {
    let selector = document.querySelectorAll(params);
    let i = 0;
    this.length = selector.length;

    for (; i < this.length; i++) {
      this[i] = selector[i];
    }
    return this;
  };

  const Ar = function(params) {
    return new argosDom(params);
  };

  const methods = {};

  methods.self = this;

  methods.hide = function() {
    let len = this.length;

    while (len--) {
      this[len].classList.add('argos-hide');
    }
    return this;
  };

  methods.show = function() {
    let len = this.length;

    while (len--) {
      this[len].classList.remove('argos-hide');
    }
    return this;
  };

  methods.toggle = function() {
    let len = this.length;

    while (len--) {
      this[len].classList.toggle('argos-hide');
    }
    return this;
  };

  methods.addClass = function(classAdd) {
    let len = this.length;

    if ( classAdd ) {
      while (len--) {
        this[len].classList.add(classAdd);
      }
    }
    return this;
  };

  methods.removeClass = function(classRemove) {
    let len = this.length;

    if ( classRemove ) {
      while (len--) {
        this[len].classList.remove(classRemove);
      }
    }
    return this;
  };

  methods.toggleClass = function(classToggle) {
    let len = this.length;

    if (classToggle ) {
      while (len--) {
        this[len].classList.toggle(classToggle);
      }
    }
    return this;
  };

  methods.setStyle = function(style, value) {
    let len = this.length;

    if ( style && value ) {
      while (len--) {
        this[len].style[style] = value;
      }
    }
    return this;
  };

  methods.fade = function() {
    let len = this.length;

    while (len--) {
      this[len].classList.add('fade');
      this[len].classList.add('fade-in');
      this[len].classList.add('fade-out');
    }

    return this;
  };

  methods.text = function(text) {
    let len = this.length;

    while (len--) {
      this[len].textContent = text;
    }

    return this;
  };

  methods.html = function(content) {
    let len = this.length;

    if ( content.indexOf('script') !== -1 ) {
      content = 'scripts are not allowed';
    }

    while (len--) {
      this[len].innerHTML = content;
    }

    return this;
  };

  methods.remove = function() {
    let len = this.length;

    while (len--) {
      if ( this[len].parentNode ) {
        this[len].parentNode.removeChild(this[len]);
      }
    }
    return true;
  };

  methods.onRender = function(node) {
    let deferred = Q.defer();
    const timer = {

      interval: function() {
        let self = this;
        let timeCount = setTimeout(function() {
          clearTimeout(timeCount);
          self.init(node);
        }, 100);
      },

      init: function(node) {
        let nodeToCheck = document.querySelectorAll(node);

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
    let object = obj;

    for(let prop in object) {
      if(object.hasOwnProperty(prop)){
        return false;
      }
    }

    return true;
  };

  methods.openModal = function(idModal) {
    let modal = document.getElementById(idModal);

    modal.setAttribute('show','show');
  };

  methods.closeModal = function() {
    this[0].setAttribute('show','hidden');
  };

  Ar.fn = argosDom.prototype = methods;

  if ( !window.Ar ) {
    window.Ar = Ar;
  }

})();
