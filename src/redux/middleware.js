import thunk from 'redux-thunk';
// import promise from 'redux-promise-middleware';
// import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { createLogger } from 'redux-logger';

const middlewares = [];

// const reactNavigation = createReactNavigationReduxMiddleware(
//     state => state.nav,
//     "root",
// );

middlewares.push(thunk)
// middlewares.push(reactNavigation)
// middlewares.push(promise)

if (__DEV__) {
    middlewares.push(createLogger());
}

export default middlewares;