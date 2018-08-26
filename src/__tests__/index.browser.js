// @flow
/* eslint-env browser */
import tape from 'tape-cup';
import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from 'fusion-core';
import {getService} from 'fusion-test-utils';
import {create as createJss} from 'jss';

import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider} from '@material-ui/core/styles';

import Plugin from '../browser.js';
import {JssToken, MuiThemeToken} from '../tokens';

Enzyme.configure({adapter: new Adapter()});

/* Test fixtures */
const testJss = createJss();
const testTheme = {foo: 'bar'};

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
  const service = getService(appCreator(null, testJss), Plugin);

  t.plan(1);

  t.equals(service.from(ctx).jss, testJss, 'passes along the jss instance');

  t.end();
});

tape('provides theme', async t => {
  const element = React.createElement('div');
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const serviceWithTheme = getService(appCreator(testTheme), Plugin);
  const serviceWithoutTheme = getService(appCreator(), Plugin);

  t.plan(2);

  const theme: any = serviceWithTheme.from(ctx).theme;
  t.equals(theme.foo, 'bar', 'passes along theme');
  t.notEqual(
    serviceWithoutTheme.from(ctx).theme,
    null,
    'but has a default theme'
  );

  t.end();
});

tape('removes useless SSR styles after render', async t => {
  const ssrStyles = document.createElement('style');
  ssrStyles.setAttribute('type', 'text/css');
  ssrStyles.setAttribute('id', '__MUI_STYLES__');
  if (!(document.body instanceof HTMLElement)) {
    return t.fail();
  }
  document.body.appendChild(ssrStyles);
  const element = React.createElement('div');
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const service = getService(appCreator(), Plugin);
  t.plan(2);
  t.notEquals(document.getElementById('__MUI_STYLES__'), null);
  try {
    await (Plugin.middleware &&
      // $FlowFixMe
      Plugin.middleware(null, service)((ctx: any), () => Promise.resolve()));
  } catch (e) {
    t.ifError(e);
  }
  t.equals(document.getElementById('__MUI_STYLES__'), null);
  t.end();
});

tape('browser middleware with default theme', async t => {
  const element = React.createElement('div');
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const service = getService(appCreator(testTheme), Plugin);
  try {
    await (Plugin.middleware &&
      // $FlowFixMe
      Plugin.middleware(null, service)((ctx: any), () => Promise.resolve()));
  } catch (e) {
    t.ifError(e);
  }
  t.plan(2);
  const rendered = mount(ctx.element);
  t.equal(rendered.find(MuiThemeProvider).length, 1);
  t.notEquals(rendered.find(MuiThemeProvider).props().theme, null);
  t.end();
});

tape('browser middleware with registered theme', async t => {
  const element = React.createElement('div');
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const service = getService(appCreator(testTheme), Plugin);
  try {
    await (Plugin.middleware &&
      // $FlowFixMe
      Plugin.middleware(null, service)((ctx: any), () => Promise.resolve()));
  } catch (e) {
    t.ifError(e);
  }
  t.plan(2);
  const rendered = mount(ctx.element);
  t.equal(rendered.find(MuiThemeProvider).length, 1);
  t.equal(rendered.find(MuiThemeProvider).props().theme, testTheme);
  t.end();
});

tape('browser middleware with jss', async t => {
  const element = React.createElement('div');
  const ctx: any = {element, template: {body: []}, memoized: new Map()};
  const testJss = createJss();
  const service = getService(appCreator(null, testJss), Plugin);
  try {
    await (Plugin.middleware &&
      // $FlowFixMe
      Plugin.middleware(null, service)((ctx: any), () => Promise.resolve()));
  } catch (e) {
    t.ifError(e);
  }
  t.plan(2);
  const rendered = mount(ctx.element);
  t.equal(rendered.find(JssProvider).length, 1);
  t.equal(rendered.find(JssProvider).props().jss, testJss);
  t.end();
});
