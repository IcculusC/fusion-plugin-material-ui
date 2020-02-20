// @flow
import App, {consumeSanitizedHTML, type Context} from 'fusion-core';
import {getService, getSimulator, createRenderContext} from 'fusion-test-utils';
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

test('provides a custom jss instance', async done => {
  const ctx: Context = createRenderContext('');
  const testJss = createJss();
  const service = getService(appCreator(null, testJss), Plugin);

  expect.assertions(1);

  expect(service.from(ctx).jss).toBe(testJss);

  done();
});

test('provides theme', async done => {
  const ctx: Context = createRenderContext('');
  const serviceWithTheme = getService(appCreator({foo: 'bar'}), Plugin);
  const serviceWithDefaultTheme = getService(appCreator(), Plugin);

  expect.assertions(2);

  const withTheme: any = serviceWithTheme.from(ctx).theme;
  const withDefaultTheme: any = serviceWithDefaultTheme.from(ctx).theme;

  expect(withTheme.foo).toBe('bar');
  expect(withDefaultTheme.spacing()).toBe(8);

  done();
});

test('serialization', async done => {
  const simulator = getSimulator(appCreator()(), Plugin);

  expect.assertions(3);

  const ctx: Context = await simulator.render('/');

  expect(ctx.template.head.length).toBe(1);
  expect(
    // $FlowFixMe
    consumeSanitizedHTML(ctx.template.head[0]).match('</style>').input
  ).toBe('<style type="text/css" id="__MUI_STYLES__"></style>');
  expect(consumeSanitizedHTML(ctx.template.head[0]).match('</div>')).toBe(null);
  done();
});
