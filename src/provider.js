// @flow
import {memoize} from 'fusion-core';
import {SheetsRegistry} from 'react-jss/lib/jss';
import {create as createJss} from 'jss';
import {createMuiTheme, jssPreset} from '@material-ui/core/styles';

import type {Context} from 'fusion-core';

console.log(jssPreset);

export const provides = ({jss, theme}) => {
  class MuiService<T> {
    constructor(ctx) {
      this.ctx = ctx;
      this.sheetsRegistry = new SheetsRegistry();
      this.theme = theme ? theme : createMuiTheme();
      if (jss) {
        this.jss = jss;
      } else {
        this.jss = createJss();
        this.jss.setup(jssPreset);
      }
    }

    // TODO: More specific types
    theme: T;
    ctx: Context;
    sheetsRegistry: mixed;
    jss: mixed;
  }
  return {
    from: memoize(ctx => new MuiService(ctx)),
  };
};
