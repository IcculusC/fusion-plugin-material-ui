// @flow
/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import type {FusionPlugin} from 'fusion-core';

import {addProviders} from './middleware';
import {JssToken, MuiThemeToken} from './tokens';
import {provides} from './provider';

import type {MaterialUIDepsType, MaterialUIServiceType} from './types.js';

const plugin = createPlugin({
  deps: {theme: MuiThemeToken.optional, jss: JssToken.optional},
  provides,
  middleware(_, muiService: MaterialUIServiceType) {
    return async (ctx, next) => {
      if (!ctx.element) return next();

      ctx.element = await addProviders(ctx, muiService);

      await next();

      const el = document && document.getElementById('__MUI_STYLES__');
      if (el) el.remove();
    };
  },
});

export default ((plugin: any): FusionPlugin<
  MaterialUIDepsType,
  MaterialUIServiceType
>);
