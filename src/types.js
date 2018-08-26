// @flow
import type {Context} from 'fusion-core';
import {JssToken, MuiThemeToken} from './tokens';

export type MuiThemeProviderDepsType = {
  theme: MuiThemeToken.optional,
  jss: JssToken.optional,
};

export type MuiThemeProviderServiceType = {
  from: (
    ctx?: Context
  ) => {
    ctx?: Context,
    jss?: any,
    theme: any,
  },
};
