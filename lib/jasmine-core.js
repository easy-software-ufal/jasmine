/**
 * Note: Only available on Node.
 * @module jasmine-core
 */

const jasmineRequire = require('./jasmine-core/jasmine.js');
module.exports = jasmineRequire;

const bootOnce = (function() {
  let jasmine, jasmineInterface;

  return function bootWithoutGlobals() {
    if (!jasmineInterface) {
      jasmine = jasmineRequire.core(jasmineRequire);
      const env = jasmine.getEnv({ suppressLoadErrors: true });
      jasmineInterface = jasmineRequire.interface(jasmine, env);
    }

    return {jasmine, jasmineInterface};
  };
}());

/**
 * Boots a copy of Jasmine and returns an object as described in {@link jasmine}.
 * If boot is called multiple times, the same object is returned every time.
 * @type {function}
 * @return {jasmine}
 */
module.exports.boot = function() {
  const {jasmine, jasmineInterface} = bootOnce();

  for (const k in jasmineInterface) {
    global[k] = jasmineInterface[k];
  }

  return jasmine;
};

/**
 * Boots a copy of Jasmine and returns an object containing the properties
 * that would normally be added to the global object. If noGlobals is called
 * multiple times, the same object is returned every time.
 *
 * @example
 * const {describe, beforeEach, it, expect, jasmine} = require('jasmine-core').noGlobals();
 */
module.exports.noGlobals = function() {
  const {jasmineInterface} = bootOnce();
  return jasmineInterface;
};

const path = require('path'),
  fs = require('fs');

const rootPath = path.join(__dirname, 'jasmine-core'),
  bootFiles = ['boot0.js', 'boot1.js'],
  legacyBootFiles = ['boot.js'],
  cssFiles = [],
  jsFiles = [],
  jsFilesToSkip = ['jasmine.js'].concat(bootFiles, legacyBootFiles);

fs.readdirSync(rootPath).forEach(function(file) {
  if(fs.statSync(path.join(rootPath, file)).isFile()) {
    switch(path.extname(file)) {
      case '.css':
        cssFiles.push(file);
      break;
      case '.js':
        if (jsFilesToSkip.indexOf(file) < 0) {
          jsFiles.push(file);
        }
      break;
    }
  }
});

module.exports.files = {
  self: __filename,
  path: rootPath,
  bootDir: rootPath,
  bootFiles: bootFiles,
  cssFiles: cssFiles,
  jsFiles: ['jasmine.js'].concat(jsFiles),
  imagesDir: path.join(__dirname, '../images')
};
