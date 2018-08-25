// @flow
/* eslint-env browser */
import React from 'react';
import {createPlugin} from 'fusion-core';
import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {MuiThemeToken, JssToken} from './tokens';

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {theme: MuiThemeToken.optional, jss: JssToken.optional},
    middleware({theme, jss}) {
      return async (ctx, next) => {
        if (!ctx.element) return next();

        if (theme) {
          ctx.element = (
            <MuiThemeProvider theme={theme}>{ctx.element}</MuiThemeProvider>
          );
        }

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
