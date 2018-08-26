// @flow

import {MuiThemeToken, JssToken} from './tokens.js';

import type {Context} from 'fusion-core';

export type MaterialUIDepsType = {
  theme: typeof MuiThemeToken.optional,
  jss: JssToken.optional,
};

export type MaterialUIServiceType = {
  from: (
    ctx?: Context
  ) => {
    ctx?: Context,
    // TODO: More specific types
    theme: mixed,
    ctx: Context,
    sheetsRegistry: mixed,
    jss: mixed,
  },
};
