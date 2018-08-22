import React from 'react';
import {createPlugin} from 'fusion-core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {MuiThemeToken} from './tokens';

const getPlugin = () =>
  createPlugin({
    // deps: {muiTheme: MuiThemeToken.optional},
    provides({muiTheme}) {
      return {
        theme: muiTheme || createMuiTheme(),
      };
    },
    middleware(_, {theme}) {
      return (ctx, next) => {
        if (ctx.element) {
          ctx.element = (
            <MuiThemeProvider theme={theme}>{ctx.element}</MuiThemeProvider>
          );
        }
        return next();
      };
    },
  });

export default getPlugin;
