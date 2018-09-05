# fusion-plugin-material-ui

This plugin will provide drop in support for "just works" server side rendering [`material-ui`](https://material-ui.com/) components.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
  * [Dependencies](#dependencies)
* [Advanced Usage](#advancedusage)

---

### Installation

```js
yarn add fusion-plugin-material-ui
```

### Usage

```js
// ButtonWrap.js
import React from 'react';
import Button from '@material-ui/styles/Button';

export ButtonWrap = () => (
  <Button
    variant="contained"
    color="primary"
  >
    with bacon
  </Button>
)
```

### Setup

#### The Basic

```js
// main.js
import React from 'react';
import App from 'fusion-react';

import MuiThemeProvider, {
  MuiThemeProviderToken,
} from 'fusion-plugin-material-ui';

export default () => {
  const app = new App(root);
  // will use the default theme
  app.register(MuiThemeProviderToken, MuiThemeProvider);
  return app;
};
```

#### Custom Theme

[https://material-ui.com/customization/themes/](https://material-ui.com/customization/themes/)

```js
// main.js
import React from 'react';
import App from 'fusion-react';

import MuiThemeProvider, {
  MuiThemeProviderToken,
  MuiThemeToken,
} from 'fusion-plugin-material-ui';
import {createMuiTheme} from '@material-ui/core/styles';

export default () => {
  const app = new App(root);
  app.register(MuiThemeToken, createMuiTheme({fooColor: '#ba4'}));
  app.register(MuiThemeProviderToken, MuiThemeProvider);
  return app;
};
```

### API

#### Registration API

##### `MuiThemeProvider`

```js
import MuiThemeProvider from 'fusion-plugin-material-ui';
```

Adds the `MuiThemeProvider` from `@material-ui/core` and handles server side rendering. Typically registered with [`MuiThemeProviderToken`](#muithemeprovidertoken)

##### `MuiThemeProviderToken`

```js
import {MuiThemeProviderToken} from 'fusion-plugin-material-ui';
```

Typicall registered with [`MuiThemeProvider`](#muithemeprovider)

#### Dependencies

##### `MuiThemeToken`

```js
import {MuiThemeToken} from 'fusion-plugin-material-ui';
```

Register with your own custom `material-ui` theme.
Optional

##### `JssToken`

```js
import {JssToken} from 'fusion-plugin-material-ui';
```

Register with your own custom [`jss`](https://cssinjs.org) instance.
Optional
&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

### Advanced Usage

#### Custom JSS instance

This requires management of a custom [`jss`](https://cssinjs.org) instance.

[https://material-ui.com/customization/css-in-js/](https://material-ui.com/customization/css-in-js/)

```js
// main.js
import React from 'react';
import App from 'fusion-react';

import {create} from 'jss';
import MuiThemeProvider, {
  JssToken,
  MuiThemeProviderToken,
} from 'fusion-plugin-material-ui';

export default () => {
  const app = new App(root);

  app.register(JssToken, create());
  app.register(MuiThemeProviderToken, MuiThemeProvider);
  return app;
};
```
