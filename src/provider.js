// @flow
import {memoize} from 'fusion-core';
import {Jss, SheetsRegistry} from 'react-jss/lib/jss';
import {create as createJss} from 'jss';
import {
  createMuiTheme,
  jssPreset,
  createGenerateClassName,
} from '@material-ui/core/styles';

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
        this.jss = createJss(jssPreset());
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
