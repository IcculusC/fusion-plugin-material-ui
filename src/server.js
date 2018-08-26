// @flow
/* eslint-env node */
import React from 'react';
import {createPlugin, html, memoize} from 'fusion-core';
import defaultJss, {SheetsRegistry} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeToken, JssToken} from './tokens';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {theme: MuiThemeToken.optional, jss: JssToken.optional},
    provides({jss, theme}) {
      class MuiService {
        constructor(ctx) {
          this.sheetsRegistry = new SheetsRegistry();
          this.ctx = ctx;
          this.jss = jss ? jss : defaultJss;
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
        const {jss, sheetsRegistry, theme} = await muiService.from(ctx);

        ctx.element = (
          <JssProvider jss={jss} registry={sheetsRegistry}>
            <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
              {ctx.element}
            </MuiThemeProvider>
          </JssProvider>
        );

        await next();

        const serialized = await postcss([autoprefixer]).process(
          sheetsRegistry.toString()
        );
        const styles = html`<style type="text/css" id="__MUI_STYLES__">${serialized}</style>`;
        ctx.template.body.push(styles);
      };
    },
  });

export default plugin;
