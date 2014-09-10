Indecent.js
===========

An indecently opinionated YAML configuration loader.

What is this Indecent.js and why is it so *indecent*?
-----------------------------------------------------

Indecent.js is a YAML configuration loader for your node projects. It is **very** opinionated because there are no configuration options, all is assumed following the *convention over configuration* ideal.

Indecent.js expects the following from your project to work:

- There is a `config` folder at your project root.
- There is a `config.yml` file on the `config` folder
- Indecent.js is loaded **always** for the first time on your main application javascript file.

In exchange for this assumptions, Indecent.js will do the following for you:

- Automagically load `config/config.yml`, parse it and expose it to your files.
- Automagically load any `.yml` that matches your `NODE_ENV` variable and override the config values on `config/config.yml`

How to use it
-------------

### TL;DR (Short version)

Install it by doing

```
npm install --save indecent
```

On your main application file (the one executed by Node.js):

```js
var config = require('indecent');
```

And later on any other javascript file (yes, it is the same):

```js
var config = require('indecent');
```

Want more details? Continue with the long version.

### Long version

Install it by doing

```
npm install --save indecent
```

Indecent.js **must** be required for the first time on your main application because it relies on its path to assume the location of `config/config.yml` and also because it reads the configuration files synchronously; but don't worry, this is only done once (when your application is started). After this initial require is done, you can require Indecent.js on **all** your files and it will return the cached configuration.

#### Example

Below is an example of a simple application first without and later with Indecent.js.

In our ACME application, our main file is `app.js` and it looks something like this:

```js
'use strict';

var express = require('express'),
  path = require('path'),
  app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var server = app.listen(3000, function() {
  console.log('Express server listening on port ' + server.address().port);
});
```

If we want to take that port and views values out of our code so we can use a configuration file, using Indecent.js it will look like this:

```js
'use strict';

var express = require('express'),
  path = require('path'),
  app = express(),
  config = require('indecent');

app.set('views', path.join(__dirname, config.views));
app.set('view engine', 'ejs');

var server = app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});
```

And, on `config/config.yml`

```yaml
views: views
port: 3000
```

Environment specific overrides
------------------------------

Another common requirement for your configurations is to have different values for local, development, testing and/or production servers. This is already built in Indecent.js guts and it will follow the commonly used `NODE_ENV` value to load overriding files.

It works as follows:

- Load `config/config.yml`
- Load `config/${NODE_ENV}.yml` (if any)
- Override values from `config/config.yml` with those found on `config/${NODE_ENV}.yml`

Your configuration files can have multiple nesting levels. Indecent.js will merge the files and override only those values that are present on both instead of just replacing root attributes.

### Examples

For the following examples, assume our `NODE_ENV` value is `production`.

#### Single configuration file

config/config.yml
```yaml
port: 3000
views: views
foo: bar
```

config/production.yml
```yaml
port: 80
views: dist/views
bar: baz
```

Final object
```js
{
  port: 80
  views: 'dist/views'
  foo: 'bar'
  bar: 'baz'
}
```

#### Nested values

config/config.yml
```yaml
port: 3000
views: views
foo:
  bar:
    test: true
  baz: 1000
```

config/production.yml
```yaml
port: 80
views: dist/views
foo:
  bar:
    test: false
    buzz: 8
  fizz: 5
```

Final object
```js
{
  port: 80,
  views: 'dist/views',
  foo: {
    bar: {
      test: false,
      buzz: 8
    },
    baz: 1000,
    fizz: 5
  }
}
```
