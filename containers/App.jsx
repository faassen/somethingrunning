import React from 'react';
import ConnectedApp from './ConnectedApp';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from '../reducers/reducer';
import {
    handleServerActionCreator,
    processServerActionCreator } from '../actions/worker';

const ACTION_PROCESSING_PAUSE = 1000;

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducer);

function fakeFetch(url, init) {
    console.log('fake fetch:');
    console.log('URL: ' + url);
    console.log('init:');
    console.log(init);
    const result = { '@id': 'an update url' };
    console.log('result:');
    console.log(result);
    return Promise.resolve(result);
}

const handleServerAction = handleServerActionCreator(fakeFetch);

function success() {
    return dispatch => {
        dispatch(processServerAction());
    };
}

function again() {
    return dispatch => {
        setTimeout(() => dispatch(processServerAction()),
                   ACTION_PROCESSING_PAUSE);
    };
}

const processServerAction = processServerActionCreator(
    handleServerAction, success, again);


export default class App extends React.Component {
    componentWillMount() {
        store.dispatch(processServerAction());
    }
    render() {
        return (
            <Provider store={store}>
                {() => <ConnectedApp /> }
            </Provider>
        );
    }
}
