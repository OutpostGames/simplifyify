'use strict';

const through = require('through2');
const minimatch = require('minimatch');

module.exports = applyVendor;

function vendorify (b, options) {
  b.pipeline.get('deps').push(through.obj((row, enc, next) => {
    let isVendor = minimatch(row.file, '**/node_modules/**');

    if(isVendor && options.vendor === false) {
      b.external(row.file);
    }
    else if(!isVendor && options.vendor === true) {
      b.exclude(row.file);
    }

    next(null, row);
  }));
}

/**
 * Adds the Vendor transform to the given Browserify or Watchify instance.
 *
 * @param {Browserify} browserify - The Browserify or Watchify instance
 * @param {object} manifest - The project manifest (package.json file)
 * @param {object} [options] - The Banner options, if any
 */
function applyVendor (browserify, manifest, options) {
  options = options || {};

  if (options.vendor !== undefined) {
    browserify.plugin(vendorify, options);
  }
}
