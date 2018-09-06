// @flow
import browserPlugin from './browser';
import serverPlugin from './server';

import type {FusionPlugin} from 'fusion-core';
import type {MaterialUIDepsType, MaterialUIServiceType} from './types.js';

export {JssToken, MuiThemeToken, MuiThemeProviderToken} from './tokens';

export default (((__NODE__ ? serverPlugin : browserPlugin): any): FusionPlugin<
  MaterialUIDepsType,
  MaterialUIServiceType
>);
