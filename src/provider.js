// @flow
import {memoize} from 'fusion-core';
import {create as createJss, Jss, SheetsRegistry} from 'jss';
import createGenerateClassName from '@material-ui/styles/createGenerateClassName';
import {createMuiTheme, Theme} from '@material-ui/core/styles';
import jssPreset from '@material-ui/styles/jssPreset';

import type {Context} from 'fusion-core';
import type {GenerateId} from 'jss';
import type {MaterialUIServiceType} from './types';

export const provides = ({
  jss,
  theme,
}: {
  jss: Jss,
  theme: Theme,
}): MaterialUIServiceType => {
  const muiService = (
    ctx: Context
  ): {
    ctx: Context,
    generateClassName: GenerateId,
    jss: Jss,
    sheetsRegistry: SheetsRegistry,
    theme: Theme,
  } => ({
    ctx,
    generateClassName: createGenerateClassName(),
    jss: jss ? jss : createJss(jssPreset()),
    sheetsRegistry: new SheetsRegistry(),
    theme: createMuiTheme(theme),
  });

  return {from: memoize(muiService)};
};
