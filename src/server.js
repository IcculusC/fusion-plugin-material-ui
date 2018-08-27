// @flow
/* eslint-env node */
import {createPlugin, dangerouslySetHTML} from 'fusion-core';
import {MuiThemeToken, JssToken} from './tokens';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

import type {FusionPlugin} from 'fusion-core';
import type {MaterialUIDepsType, MaterialUIServiceType} from './types.js';
import {addProviders} from './middleware';
import {provides} from './provider';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {theme: MuiThemeToken.optional, jss: JssToken.optional},
    provides,
    middleware(_, muiService) {
      return async (ctx, next) => {
        if (!ctx.element) return next();
        const {sheetsRegistry} = muiService.from(ctx);

        ctx.element = await addProviders(ctx, muiService);

        await next();

        const serialized = await postcss([autoprefixer]).process(
          // $FlowFixMe
          sheetsRegistry.toString()
        );
        const styles = dangerouslySetHTML(
          `<style type="text/css" id="__MUI_STYLES__">${serialized}</style>`
        );
        ctx.template.body.push(styles);
      };
    },
  });

export default ((plugin: any): FusionPlugin<
  MaterialUIDepsType,
  MaterialUIServiceType
>);
