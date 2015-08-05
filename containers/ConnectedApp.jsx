import React from 'react';
import { bindActionCreators } from 'redux';
import { Connector } from 'react-redux';
import * as Actions from '../actions/Actions';

function select(state) {
    return { items: state.get('items').valueSeq().toJS() };
}

export default class ConnectedApp extends React.Component {
    render() {
        return (
            <Connector select={select}>
                {this.renderChild}
            </Connector>
        );
    }
    renderChild({items, dispatch}) {
        const actions = bindActionCreators(Actions, dispatch);
        const add = () => {
            actions.add({ title: 'Unchanged' });
        };
        const update = () => {
            actions.update({ clientId: 0, title: 'Changed!' });
        };
        return (
            <div>
                <ul>
                    {items.map(item => {
                        return (
                            <li key={item.clientId}>
                                {item.title}
                            </li>
                        );
                     })}
                </ul>
                <button onClick={add}>Add new item</button>
                <button onClick={update}>Update first item</button>
            </div>
        );
    }
}
