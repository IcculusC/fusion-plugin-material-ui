// @flow
/* eslint-env browser */
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from 'fusion-core';
import {createRenderContext, getService, getSimulator} from 'fusion-test-utils';
import {create as createJss} from 'jss';
import StylesProvider from '@material-ui/styles/StylesProvider';
import ThemeProvider from '@material-ui/styles/ThemeProvider';

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

test('provides a custom jss instance', async done => {
  const ctx: any = createRenderContext('');
  const service = getService(appCreator(null, testJss), Plugin);

  expect.assertions(1);

  expect(service.from(ctx).jss).toBe(testJss);

  done();
});

test('provides theme', async done => {
  const ctx: any = createRenderContext('');
  const serviceWithTheme = getService(appCreator(testTheme), Plugin);
  const serviceWithoutTheme = getService(appCreator(), Plugin);

  expect.assertions(2);

  const theme: any = serviceWithTheme.from(ctx).theme;
  expect(theme.foo).toBe('bar');
  expect(serviceWithoutTheme.from(ctx).theme).not.toBeNull();

  done();
});

test('removes useless SSR styles after render', async done => {
  const ssrStyles = document.createElement('style');
  ssrStyles.setAttribute('type', 'text/css');
  ssrStyles.setAttribute('id', '__MUI_STYLES__');
  if (!(document.body instanceof HTMLElement)) {
    return done();
  }
  document.body.appendChild(ssrStyles);
  expect.assertions(2);
  expect(document.getElementById('__MUI_STYLES__')).not.toBeNull();
  try {
    await getSimulator(appCreator()(), Plugin).render('/');
  } catch (e) {
    done(e);
  }
  expect(document.getElementById('__MUI_STYLES__')).toBeNull();
  done();
});

test('browser middleware with default theme', async done => {
  let ctx;
  try {
    ctx = await getSimulator(appCreator()(), Plugin).render('/');
  } catch (e) {
    done(e);
  }
  expect.assertions(2);
  const rendered = mount(ctx.element);
  const themeProvider = rendered.find(ThemeProvider);
  expect(themeProvider).toHaveLength(1);
  expect(themeProvider.prop('theme')).not.toBeNull();
  done();
});

test('browser middleware with registered theme', async done => {
  let ctx;
  try {
    ctx = await getSimulator(appCreator(testTheme)(), Plugin).render('/');
  } catch (e) {
    done(e);
  }
  expect.assertions(2);
  const rendered = mount(ctx.element);
  const themeProvider = rendered.find(ThemeProvider);
  expect(themeProvider).toHaveLength(1);
  expect(themeProvider.prop('theme')).toEqual(
    expect.objectContaining(testTheme)
  );
  done();
});

test('browser middleware with jss', async done => {
  const testJss = createJss();
  let ctx;
  try {
    ctx = await getSimulator(appCreator(null, testJss)(), Plugin).render('/');
  } catch (e) {
    done(e);
  }
  expect.assertions(2);
  const rendered = mount(ctx.element);
  const stylesProvider = rendered.find(StylesProvider);
  expect(stylesProvider).toHaveLength(1);
  expect(stylesProvider.prop('jss')).toEqual(testJss);
  done();
});
