import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
// import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { createLogger } from 'redux-logger';

const middlewares = [];

// const reactNavigation = createReactNavigationReduxMiddleware(
//     state => state.nav,
//     "root",
// );

if (__DEV__) {
    middlewares.push(createLogger());
}

middlewares.push(thunk)
// middlewares.push(reactNavigation)
middlewares.push(promise)

export default middlewares;