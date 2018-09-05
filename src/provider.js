// @flow
import {memoize} from 'fusion-core';
import {SheetsRegistry} from 'react-jss/lib/jss';
import {create as createJss} from 'jss';
import {
  createMuiTheme,
  jssPreset,
  createGenerateClassName,
} from '@material-ui/core/styles';

import type {Context} from 'fusion-core';

export const provides = ({jss, theme}: any) => {
  class MuiService<T> {
    constructor(ctx) {
      this.ctx = ctx;
      this.sheetsRegistry = new SheetsRegistry();
      this.generateClassName = createGenerateClassName();
      this.sheetsManager = new Map();
      this.theme = theme ? theme : createMuiTheme();
      if (jss) {
        this.jss = jss;
      } else {
        this.jss = createJss(jssPreset());
      }
    }

    // TODO: More specific types
    theme: T;
    ctx: Context;
    sheetsRegistry: mixed;
    jss: mixed;
    generateClassName: mixed;
    sheetsManager: mixed;
  }
  return {
    from: memoize(ctx => new MuiService(ctx)),
  };
};
