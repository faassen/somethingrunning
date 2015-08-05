import * as types from '../constants/ActionTypes';

function defaultLogFailure() {
}

function defaultComplete() {
    return { type: types.SERVER_COMPLETE };
}

export function processServerActionCreator(
    handleAction, success, again,
    complete=defaultComplete, logFailure=defaultLogFailure) {
    return () => {
        return (dispatch, getState) => {
            const state = getState();
            const actions = state.get('actions');
            // if there are no actions to process check again a little while
            if (actions.size === 0) {
                dispatch(again());
                dispatch(complete());
                return;
            }
            dispatch({
                type: types.SERVER_START
            });
            const action = actions.first();
            handleAction(state, action, dispatch)
                .then(() => {
                    dispatch(success());
                    dispatch(complete());
                })
                .catch((reason) => {
                    logFailure(reason);
                    dispatch({
                        type: types.SERVER_FAIL,
                        action: action.toJS()
                    });
                    dispatch(again());
                    dispatch(complete());
                });
        };
    };
}

export function handleServerActionCreator(fetch) {
    function serverAdd(state, action, dispatch) {
        const url = state.get('add');
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(action.get('item').toJS())
        }).then(result => {
            dispatch({
                type: types.SERVER_UPDATE,
                clientId: action.getIn(['item', 'clientId']),
                item: result
            });
        });
    }

    function serverUpdate(state, action, dispatch) {
        const clientId = action.getIn(['item', 'clientId']);
        const url = state.getIn(['items', clientId, '@id']);
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(action.get('item').toJS())
        }).then(result => {
            dispatch({
                type: types.SERVER_UPDATE,
                clientId: clientId,
                item: result
            });
        });
    }

    return (state, action, dispatch) => {
        const type = action.get('type');
        switch (type) {
        case types.ADD:
            return serverAdd(state, action, dispatch);
        case types.UPDATE:
            return serverUpdate(state, action, dispatch);
        default:
            throw new Error(`Unknown server action: ${type}`);
        }
    };
}
