// @flow
import {MuiThemeToken, JssToken} from './tokens.js';

import type {Context} from 'fusion-core';
import {Jss, SheetsRegistry} from 'react-jss/lib/jss';
import type {GenerateClassName} from 'jss/lib/types';

export type MaterialUIDepsType = {
  theme: typeof MuiThemeToken.optional,
  jss: typeof JssToken.optional,
};

export type MaterialUIServiceType = {
  from: (
    ctx: Context
  ) => {
    ctx: Context,
    generateClassName: GenerateClassName,
    jss: Jss,
    sheetsManager: Map<mixed, mixed>,
    sheetsRegistry: SheetsRegistry,
    theme: mixed, // TODO: More specific type
  },
};
