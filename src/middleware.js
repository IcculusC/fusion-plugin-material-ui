// @flow
import React from 'react';
import StylesProvider from '@material-ui/styles/StylesProvider';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

import type {Context} from 'fusion-core';
import type {MaterialUIServiceType} from './types.js';

export const addProviders = async (
  ctx: Context,
  muiService: MaterialUIServiceType
) => {
  const {generateClassName, jss, sheetsRegistry, theme} = muiService.from(ctx);
  return (
    <StylesProvider
      generateClassName={generateClassName}
      jss={jss}
      sheetsRegistry={sheetsRegistry}
    >
      <ThemeProvider theme={theme}>{ctx.element}</ThemeProvider>
    </StylesProvider>
  );
};
