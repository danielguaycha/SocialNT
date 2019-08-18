import * as OnlineActions from './online.actions';
import {Action, createReducer, on} from '@ngrx/store';

export interface State {
    number: number,
    users: any,
}

export const initialState: State = {
    number: 0,
    users: []
};

const onlineReducers = createReducer(initialState,
    on(OnlineActions.addOnline, state => ({ ...state, number: state.number + 1})),
    on(OnlineActions.newUser, (state, action) => ({...state, users: [...state.users, action.user]})),
    on(OnlineActions.removeUser, (state, action) => ({ ...state, users: state.users.filter(user => user.username !== action.username )}))
);

export function reducer(state: State | undefined, action: Action) {
    return onlineReducers(state, action);
}
