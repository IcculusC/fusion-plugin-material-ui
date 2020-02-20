// @flow
import {createToken} from 'fusion-core';
import {Jss} from 'jss';
import {Theme} from '@material-ui/core/styles/createMuiTheme';
import type {FusionPlugin, Token} from 'fusion-core';

import type {MaterialUIDepsType, MaterialUIServiceType} from './types.js';

export const MuiThemeToken: Token<Theme> = createToken('MuiThemeToken');
export const MuiThemeProviderToken: Token<
  FusionPlugin<MaterialUIDepsType, MaterialUIServiceType>
> = createToken('MuiThemeProviderToken');
export const JssToken: Token<Jss> = createToken('JssToken');
