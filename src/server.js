// @flow
/* eslint-env node */
import React from 'react';
import {createPlugin, html, memoize} from 'fusion-core';
import defaultJss, {SheetsRegistry} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
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
          this.sheetsManager = new Map();
          this.generateClassName = createGenerateClassName();
        }

        // render runs twice, which means everything is included in the
        // stylesheet twice, kinda wonky, so I wrote this ridiculous code
        // to deduplicate it hopefully somewhat efficiently
        getCss(stylesheets) {
          const results = [];
          const found = {};

          for (let i = 0; i < stylesheets.length; i += 1) {
            const sheet = stylesheets[i];
            if (!found[sheet]) {
              found[sheet] = 1;
              results.push(sheet);
            }
          }

          return results;
        }
      }
      return {
        from: memoize(ctx => new MuiService(ctx)),
      };
    },
    middleware(_, muiService) {
      return async (ctx, next) => {
        if (!ctx.element) return next();

        const {
          jss,
          sheetsRegistry,
          getCss,
          generateClassName,
          theme,
        } = await muiService.from(ctx);

        if (theme) {
          ctx.element = (
            <MuiThemeProvider theme={theme}>{ctx.element}</MuiThemeProvider>
          );
        }
        ctx.element = (
          <JssProvider
            jss={jss}
            registry={sheetsRegistry}
            generateClassName={generateClassName}
          >
            {ctx.element}
          </JssProvider>
        );
        await next();

        const serialized = await postcss([autoprefixer]).process(
          getCss(sheetsRegistry.registry)
        );
        const styles = html`<style type="text/css" id="__MUI_STYLES__">${serialized}</style>`;
        ctx.template.body.push(styles);
      };
    },
  });

export default plugin;
