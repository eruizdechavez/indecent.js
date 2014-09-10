'use strict';

var fs = require('fs'),
  path = require('path'),
  yaml = require('js-yaml'),
  _ = require('lodash'),
  config, overrideConfig, filePath, yamlFile, overrideFile;

module.exports = (function () {
  // configuration already loaded?
  if (config) {
    return config;
  }

  filePath = path.dirname(require.main.filename);

  yamlFile = path.join(filePath, 'config', 'config.yml');

  // try to read the config file
  try {
    config = fs.readFileSync(yamlFile, 'utf8');
  } catch (err) {
    config = null;
  }

  // unable to read it? return null
  if (!config) {
    return config;
  }

  // try to parse yaml content
  try {
    config = yaml.safeLoad(config);
  } catch (err) {
    config = false;
  }

  // unable to parse it? return false
  if (!config) {
    return config;
  }

  // try to read and parse environment overrides
  overrideFile = path.join(filePath, 'config', process.env.NODE_ENV + '.yml');

  // unable to read or parse environment overrides? ignore and continue
  try {
    overrideConfig = yaml.safeLoad(fs.readFileSync(overrideFile, 'utf8'));
  } catch (err) {
    overrideConfig = null;
  }
  if (overrideConfig) {
    _.merge(config, overrideConfig);
  }

  // return the final config
  return config;
}());
