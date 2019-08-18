import {createAction, props} from '@ngrx/store';

export const addOnline = createAction(
    '[Online Page] Add'
);
export const newUser = createAction(
    '[Online Page] New',
    props<{ user: any }>()
);

export const removeUser = createAction(
    '[Online Page] Remove',
    props<{username: string}>()
);
