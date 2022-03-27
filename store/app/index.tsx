import { combineReducers } from '@reduxjs/toolkit';
import user from './user.slice';
import secret from './secret.slice';

export default combineReducers({
    user,
    secret,
});
