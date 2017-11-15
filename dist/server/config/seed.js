/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// import Thing from '../api/thing/thing.model';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = seedDatabaseIfNeeded;

var _environment = require('./environment/');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function seedDatabaseIfNeeded() {
  if (_environment2.default.seedDB) {
    // Thing.find({}).remove()
    //   .then(() => {
    //     let thing = Thing.create({
    //       name: 'Development Tools',
    //       info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
    //             + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
    //             + 'Stylus, Sass, and Less.'
    //     }, {
    //       name: 'Server and Client integration',
    //       info: 'Built with a powerful and fun stack: MongoDB, Express, '
    //             + 'AngularJS, and Node.'
    //     }, {
    //       name: 'Smart Build System',
    //       info: 'Build system ignores `spec` files, allowing you to keep '
    //             + 'tests alongside code. Automatic injection of scripts and '
    //             + 'styles into your index.html'
    //     }, {
    //       name: 'Modular Structure',
    //       info: 'Best practice client and server structures allow for more '
    //             + 'code reusability and maximum scalability'
    //     }, {
    //       name: 'Optimized Build',
    //       info: 'Build process packs up your templates as a single JavaScript '
    //             + 'payload, minifies your scripts/css/images, and rewrites asset '
    //             + 'names for caching.'
    //     }, {
    //       name: 'Deployment Ready',
    //       info: 'Easily deploy your app to Heroku or Openshift with the heroku '
    //             + 'and openshift subgenerators'
    //     });
    //     return thing;
    //   })
    //   .then(() => console.log('finished populating things'))
    //   .catch(err => console.log('error populating things', err));
  }
}
//# sourceMappingURL=seed.js.map
