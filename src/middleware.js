// @flow
import React from 'react';

import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider} from '@material-ui/core/styles';

import type {Context} from 'fusion-core';
import type {MaterialUIServiceType} from './types.js';

export const addProviders = async (
  ctx: Context,
  muiService: MaterialUIServiceType
) => {
  const {
    jss,
    sheetsRegistry,
    theme,
    generateClassName,
    sheetsManager,
  } = muiService.from(ctx);
  return (
    <JssProvider
      jss={jss}
      registry={sheetsRegistry}
      generateClassName={generateClassName}
    >
      <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
        {ctx.element}
      </MuiThemeProvider>
    </JssProvider>
  );
};
