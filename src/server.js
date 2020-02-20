// @flow
/* eslint-env node */
import {createPlugin, dangerouslySetHTML} from 'fusion-core';
import {SheetsRegistry} from 'jss';
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
      const {
        sheetsRegistry,
      }: {sheetsRegistry: SheetsRegistry} = muiService.from(ctx);

      ctx.element = await addProviders(ctx, muiService);

      await next();

      // $FlowFixMe
      const serialized = sheetsRegistry.toString();
      const styles = dangerouslySetHTML(
        `<style type="text/css" id="__MUI_STYLES__">${serialized}</style>`
      );
      ctx.template.head.push(styles);
    };
  },
});

export default ((plugin: any): FusionPlugin<
  MaterialUIDepsType,
  MaterialUIServiceType
>);
