// @flow

import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

// TODO: More specific types
export const MuiThemeToken: Token<any> = createToken('MuiThemeToken');
export const MuiThemeProviderToken: Token<any> = createToken(
  'MuiThemeProviderToken'
);
export const JssToken: Token<any> = createToken('JssToken');
