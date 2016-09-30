'use strict';

/**
 * @namespace views
 * @description manage templates and controllers lazy load.
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

    self.ctrlsLoaded    = [];
    self.tplsLoaded     = [];
    self.stateSelected  = {};

    if ( !scriptsContainer || !tplsContainer ) {
      log.error('nodes for lazy load are mandatory');
    }
    scriptsContainer.innerHTML = '';
    tplsContainer.innerHTML    = '';
    self.stateSelected         = router.findRouteByState(state);

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

  module.loadControllers = (state, controller)=> {
    let nodeScript = document.createElement('script');

    nodeScript.type   = 'text\/javascript';
    nodeScript.src    = './views/' +  state + '/' + controller + '.js';
    nodeScript.id     = 'js-' + controller;
    nodeScript.onload = self.addCtrlLoaded(controller);
    document.getElementById('argos-scripts-container').appendChild(nodeScript);
  };

  module.loadTemplates = (state, template)=> {
    let req = new XMLHttpRequest();
    let templatePath = './views/' +  state + '/' + template + '.html';

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

  return {
    loadView: module.loadView
  };

} )();
