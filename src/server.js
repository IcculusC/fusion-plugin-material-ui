// @flow
/* eslint-env node */
import {createPlugin, dangerouslySetHTML} from 'fusion-core';
import {SheetsRegistry} from 'react-jss/lib/jss';
import {MuiThemeToken, JssToken} from './tokens';
import type {FusionPlugin} from 'fusion-core';
import type {MaterialUIDepsType, MaterialUIServiceType} from './types.js';
import {addProviders} from './middleware';
import {provides} from './provider';

const plugin =
  __NODE__ &&
  createPlugin({
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
        const serialized: string = sheetsRegistry.toString();
        const styles: Object = dangerouslySetHTML(
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
