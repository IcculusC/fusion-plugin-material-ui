// @flow
/* eslint-env browser */
import React from 'react';
import {createPlugin, memoize} from 'fusion-core';
import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeToken, JssToken} from './tokens';

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {theme: MuiThemeToken.optional, jss: JssToken.optional},
    provides({jss, theme}) {
      class MuiService {
        constructor(ctx) {
          this.ctx = ctx;
          this.jss = jss;
          this.theme = theme ? theme : createMuiTheme();
        }
      }
      return {
        from: memoize(ctx => new MuiService(ctx)),
      };
    },
    middleware(_, muiService) {
      return async (ctx, next) => {
        if (!ctx.element) return next();

        const {jss, theme} = await muiService.from(ctx);

        ctx.element = (
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            {ctx.element}
          </MuiThemeProvider>
        );

        if (jss) {
          ctx.element = <JssProvider jss={jss}>{ctx.element}</JssProvider>;
        }

        await next();

        const el = __BROWSER__ && document.getElementById('__MUI_STYLES__');
        if (el) el.remove();
      };
    },
  });

export default plugin;
