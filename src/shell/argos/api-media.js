/**
 * @aver
 * A wrapper around jsdoc cli.
 *
 * This function collects all filenames. Then runs:
 * ```jsdoc -c config -t node_modules/ink-docstrap/template gulpFile1 gulpFile2```
 * @example
 * gulp.src(['README.md', 'src/*.js']), {read: false}).pipe(
 *     jsdoc(options, cb)
 * );
 *
 * @param {Object} [config=require('./jsdocConfig.json')]
 * @param {gulpDoneCallback} done
 * @returns {*|SignalBinding}
 */


/*eslint-disable no-unused-vars*/
var media = ( function() {
/*eslint-enable no-unused-vars*/

  var module  = {};
  var self    = module;

  module.getVendorPath = function() {
    return 'ext/vendor/';
  };

  module.loadLibrary = function(filename) {
    var fileref   = document.createElement('SCRIPT');
    var fileRoute = self.getVendorPath() + filename + '/' + filename + '.min.js';

    fileref.setAttribute('type','text/javascript');
    fileref.setAttribute('src', fileRoute);
    fileref.setAttribute('id', filename);

    document.getElementsByTagName('head')[0].appendChild(fileref);

  };

  module.exportExcel = function(jsonData, nameFile) {
    var tableString         = '';
    var colorHeadersBk      = '#eaeaea';
    var colorHeadersTxt     = '#3a3a3e';
    var colorSubheadersBk   = '#67686e';
    var colorSubheadersTxt  = '#ffffff';
    var i;
    var len;
    var c;
    var lec;

    tableString = '<table>';

    if ( jsonData.mainhead.length ) {
      tableString += '<thead>';
      tableString += '<tr>';
      i = 0;
      len = jsonData.mainhead.length;
      for (; i<len; i++) {
        tableString += '<th style=\'color:'+colorHeadersTxt+'; background-color:'+colorHeadersBk+'; text-align: left;\'>';
        tableString += jsonData.mainhead[i];
        tableString += '</th>';
      }
      tableString += '</tr>';
      tableString += '</thead>';
    }

    if ( jsonData.subhead.length ) {
      tableString += '<thead>';
      tableString += '<tr>';
      i = 0;
      len = jsonData.subhead.length;
      for (; i<len; i++) {
        tableString += '<th style=\'color:'+colorSubheadersTxt+'; background-color:'+colorSubheadersBk+'; text-align: left;\'>';
        tableString += jsonData.subhead[i];
        tableString += '</th>';
      }
      tableString += '</tr>';
      tableString += '</thead>';
    }

    i = 0;
    len = jsonData.rows.length;
    tableString += '<tbody>';
    for (; i<len; i++) {
      tableString += '<tr>';
      c = 0;
      lec = jsonData.rows[i].content.length;
      for (; c<lec; c++) {
        tableString += jsonData.rows[i].subhead ? '<td style=\'color:'+colorSubheadersTxt+'; background-color:'+colorSubheadersBk+'; text-align: left;\'>' : '<td style=\'text-align: right;\'>';
        tableString += jsonData.rows[i].content[c];
        tableString += '</td>';
      }
      tableString += '</tr>';
    }
    tableString += '</tbody>';
    tableString += '</table>';

    tableString = '\ufeff' + tableString;

    saveAs( new Blob([tableString], {'type': 'application/vnd.ms-excel'}), nameFile+'.xls');

  };

  return {
    exportExcel:  module.exportExcel
  };

} )();
