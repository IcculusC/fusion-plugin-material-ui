// @flow
import type {Context} from 'fusion-core';
import {Jss, SheetsRegistry} from 'jss';
import type {GenerateId} from 'jss';
import {Theme} from '@material-ui/core/styles';

import {MuiThemeToken, JssToken} from './tokens.js';

export type MaterialUIDepsType = {
  theme: typeof MuiThemeToken.optional,
  jss: typeof JssToken.optional,
};

export type MaterialUIServiceType = {
  from: (
    ctx: Context
  ) => {
    ctx: Context,
    generateClassName: GenerateId,
    jss: Jss,
    sheetsRegistry: SheetsRegistry,
    theme: Theme,
  },
};
