// @flow
import React from 'react';

import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider} from '@material-ui/core/styles';

export const addProviders = async (ctx, muiService) => {
  const {jss, sheetsRegistry, theme} = await muiService.from(ctx);

  return (
    <JssProvider jss={jss} registry={sheetsRegistry}>
      <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
        {ctx.element}
      </MuiThemeProvider>
    </JssProvider>
  );
}
