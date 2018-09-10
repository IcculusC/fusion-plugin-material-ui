// @flow
import {memoize} from 'fusion-core';
import {SheetsRegistry} from 'react-jss/lib/jss';
import Jss from 'jss/lib/Jss';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jssPreset from '@material-ui/core/styles/jssPreset';
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName';

import type {Context} from 'fusion-core';
import type {GenerateClassName} from 'jss/lib/types';
import type {MaterialUIServiceType} from './types';

export const provides = ({
  jss,
  theme,
}: {
  jss: Jss,
  theme: mixed,
}): MaterialUIServiceType => {
  class MuiService {
    constructor(ctx) {
      this.ctx = ctx;
      this.generateClassName = createGenerateClassName();
      if (jss) {
        this.jss = jss;
      } else {
        this.jss = new Jss(jssPreset());
      }
      this.sheetsManager = new Map();
      this.sheetsRegistry = new SheetsRegistry();
      this.theme = theme ? theme : createMuiTheme();
    }

    ctx: Context;
    generateClassName: GenerateClassName;
    jss: Jss;
    sheetsManager: Map<mixed, mixed>;
    sheetsRegistry: SheetsRegistry;
    theme: mixed; // TODO: more specific type
  }
  return {
    from: memoize((ctx: Context): MuiService => new MuiService(ctx)),
  };
};
