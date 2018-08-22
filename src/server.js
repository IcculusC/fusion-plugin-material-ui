import React from 'react';
import {renderToString} from 'react-dom/server';
import {SheetsRegistry, SheetsManager} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import {createPlugin, html, dangerouslySetHTML} from 'fusion-core';
import {MuiThemeToken} from './tokens';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {muiTheme: MuiThemeToken.optional},
    provides({muiTheme}) {
      return {
        theme: muiTheme || createMuiTheme(),
        sheetsRegistry: new SheetsRegistry(),
        sheetsManager: new Map(),
      };
    },
    middleware(_, {theme, sheetsRegistry, sheetsManager}) {
      return async (ctx, next) => {
        if (!ctx.element) return next();

        const generateClassName = createGenerateClassName();
        ctx.element = (
          <JssProvider
            registry={sheetsRegistry}
            generateClassName={generateClassName}
          >
            <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
              {ctx.element}
            </MuiThemeProvider>
          </JssProvider>
        );

        await next();

        const serialized = sheetsRegistry.toString();
        const styles = html`<style type="text/css" id="__MATERIAL_STYLES__">${serialized}</style>`;
        ctx.template.body.push(styles);
      };
    },
  });

export default plugin;
