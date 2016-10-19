'use strict';

/**
 * @namespace views
 * @description manage templates and controllers lazy load. argos-views-utils.js
 */
const views = (function() {

  const module    = {};
  const self      = module;

  module.ctrlsLoaded    = [];
  module.tplsLoaded     = [];
  module.stateSelected  = {};

  module.loadView = (state)=> {
    let deferred          = Q.defer();
    let len               = 0;
    let stateSelected     = {};
    let scriptsContainer  = document.getElementById('argos-scripts-container');
    let tplsContainer     = document.getElementById('argos-templates-container');
    let allPromisses      = [];
    let currentCtrl       = '';

    self.ctrlsLoaded    = [];
    self.tplsLoaded     = [];
    self.stateSelected  = {};

    if ( !scriptsContainer || !tplsContainer ) {
      log.error('nodes for lazy load are mandatory');
    }

    /* todo: llevar a un método empty() de argosDom */
    while (scriptsContainer.firstChild) {
      currentCtrl = scriptsContainer.firstChild.getAttribute('data-ctrl');
      if ( window.hasOwnProperty(currentCtrl) ) {
        delete window[currentCtrl];
      }
      scriptsContainer.removeChild(scriptsContainer.firstChild);
    }
    while (tplsContainer.firstChild) {
      tplsContainer.removeChild(tplsContainer.firstChild);
    }
    self.stateSelected = router.findRouteByState(state);

    len = self.stateSelected.controllers.length;
    while(len--) {
      self.loadControllers(state, self.stateSelected.controllers[len]);
    }

    len = self.stateSelected.templates.length;
    while(len--) {
      allPromisses.push(self.loadTemplates(state, self.stateSelected.templates[len]));
    }

    Q.all(allPromisses).then( (results)=> {
      self.checkAllReady().then( ()=> {
        let timeout = setTimeout(function() {
          deferred.resolve();
          clearTimeout(timeout);
        }, 50);
      });
    }, (error)=> {
      log.error('error get controller data: '+state);
      deferred.reject();
    });

    return deferred.promise;
  };

  module.getNameController  = (controller)=> {
    let ctrlName = controller.split('-');
    let name = ctrlName.shift();
    let i = 0;
    let len = ctrlName.length;

    for (; i<len; i++) {
      name += ctrlName[i].charAt(0).toUpperCase() + ctrlName[i].slice(1);
    }
    return name;
  };

  module.loadControllers = (state, controller)=> {
    let nodeScript      = document.createElement('script');
    let controllerName  = self.getNameController(controller);

    nodeScript.type   = 'text\/javascript';
    nodeScript.src    = './shell/theme/views/' +  state + '/' + controller + '.js';
    nodeScript.id     = 'js-' + controller;
    nodeScript.onload = self.addCtrlLoaded(controller);
    document.getElementById('argos-scripts-container').appendChild(nodeScript);
    nodeScript.setAttribute('data-ctrl', controllerName);
  };

  module.loadTemplates = (state, template)=> {
    let req = new XMLHttpRequest();
    let templatePath = './shell/theme/views/' +  state + '/' + template + '.html';

    req.open('GET', templatePath, true);

    req.onreadystatechange = function() {
      let templateScript;
      if (req.readyState === 4 && req.status === 200) {
        templateScript = document.createElement('div');
        templateScript.innerHTML = req.responseText;
        document.getElementById('argos-templates-container').appendChild(templateScript);
      }
    };

    req.send();
  };

  module.addCtrlLoaded = (controller)=> {
    self.ctrlsLoaded.push(controller);
  };

  module.checkAllReady = ()=> {
    let deferred  = Q.defer();
    let check     = true;
    let entryCtrl = self.stateSelected.entry.split('.').shift().toString();

    if ( self.ctrlsLoaded.length === !self.stateSelected.controllers.length ) {
      check = false;
    }

    if ( check ) {
      deferred.resolve();
    } else {
      self.timer();
    }

    return deferred.promise;
  };

  module.timer = ()=> {
    let timeout = setTimeout(function() {
      self.checkAllReady();
      clearTimeout(timeout);
    }, 10);
  };


  module.loadNonStateTemplates = (template)=> {
    let req = new XMLHttpRequest();
    let templatePath = './shell/theme/views/' +  template + '.html';
    let deferred = Q.defer()

    req.open('GET', templatePath, true);

    req.onreadystatechange = function() {
      let templateScript;
      if (req.readyState === 4 && req.status === 200) {
        templateScript = document.createElement('div');
        templateScript.innerHTML = req.responseText;
        document.getElementById('argos-templates-container').appendChild(templateScript);
        deferred.resolve();
      }
    };

    req.send();
    return deferred.promise;
  };

  return {
    loadView: module.loadView,
    loadNonStateTemplates: module.loadNonStateTemplates
  };

} )();
