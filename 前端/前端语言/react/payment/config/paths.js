'use strict';

const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};
// config after eject: we're in ./config/

const DOMAIN = process.env.DOMAIN || '';
const IS_PROD=DOMAIN.includes('checkout.starservices.store');
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('../build/checkout'),
  appPublic: resolveApp('public'),

  // appHtml: process.env.NODE_ENV === 'development' ? resolveApp('public/_test_onepage.html') : resolveApp('public/index.html'),
  // appIndexJs: resolveModule(resolveApp, 'src/index'),
  appOnePageJs: resolveModule(resolveApp, 'src/onepage_ui/index'),
  appGalaxyJs: resolveModule(resolveApp, IS_PROD ? 'src/galaxy_ui/index' : 'src/galaxy_ui/index_test'),
  appVivaiaJs: resolveModule(resolveApp, IS_PROD ? 'src/vivaia_ui/index' : 'src/vivaia_ui/index_test'),


  // appAdoraweJs: resolveModule(resolveApp, IS_PROD?'src/adorawe_ui/index':'src/adorawe_ui/index_test'),
  appOutHtmlOnePage: process.env.NODE_ENV === 'development' ? resolveApp('public/_test_onepage.html') : resolveApp('public/onepage.html'),
  appOutHtmlGalaxy: process.env.NODE_ENV === 'development' ? resolveApp('public/_test_galaxy.html') : resolveApp('public/galaxy.html'),
  appOutHtmlVivaia: process.env.NODE_ENV === 'development' ? resolveApp('public/_test_vivaia.html') : resolveApp('public/vivaia.html'),
  // appOutHtmlAdorawe: process.env.NODE_ENV === 'development' ? resolveApp('public/_test_adorawe.html') : resolveApp('public/adorawe.html'),

  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrlOrPath,
};



module.exports.moduleFileExtensions = moduleFileExtensions;
