// @flow
import tape from 'tape-cup';
import React from 'react';

import App, {consumeSanitizedHTML} from 'fusion-core';
import {getService} from 'fusion-test-utils';
import {create as createJss} from 'jss';

import Plugin, {JssToken, MuiThemeToken} from '../index.js';

/* Test fixtures */
const appCreator = (theme, jss) => {
  const app = new App('test', el => el);
  if (theme) {
    app.register(MuiThemeToken, theme);
  }
  if (jss) {
    app.register(JssToken, jss);
  }
  return () => app;
};

tape('provides a custom jss instance', async t => {
  const element = React.createElement('div');
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const testJss = createJss();
  const service = getService(appCreator(null, testJss), Plugin);

  t.plan(1);

  t.equals(service.from(ctx).jss, testJss, 'passes along the jss instance');

  t.end();
});

tape('provides theme', async t => {
  const element = React.createElement('div');
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const serviceWithTheme = getService(appCreator({foo: 'bar'}), Plugin);
  const serviceWithoutTheme = getService(appCreator(), Plugin);

  t.plan(2);

  const withTheme: any = serviceWithTheme.from(ctx).theme;
  const withoutTheme: any = serviceWithoutTheme.from(ctx).theme;

  t.equals(withTheme.foo, 'bar', 'passes along theme');
  t.notEqual(withoutTheme.spacing.unit, null, 'but has a default theme');

  t.end();
});

tape('serialization', async t => {
  const element = React.createElement('div'); // Button, {variant: 'contained', color: 'primary'});
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const service = getService(appCreator(), Plugin);

  t.plan(3);

  // $FlowFixMe
  await Plugin.middleware(null, service)(ctx, () => Promise.resolve());
  t.equals(ctx.template.body.length, 1, 'pushes serialization to body');
  t.equals(
    // $FlowFixMe
    consumeSanitizedHTML(ctx.template.body[0]).match('</style>').input,
    '<style type="text/css" id="__MUI_STYLES__"></style>'
  );
  t.equals(consumeSanitizedHTML(ctx.template.body[0]).match('</div>'), null);
  t.end();
});
