import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';
import UserModel from '../../model/user.model';
import SessionService from '../../service/session.service';

export const logout = () => async (dispatch: Dispatch<any>) => {
    await signOut({
        redirect: false,
    });

    await SessionService.endSession();

    dispatch(clearUser());
};

const initialState: UserModel = {
    email: '',
};

const UserSlice = createSlice({
    name: 'app/user',
    initialState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<UserModel>) => payload,
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = UserSlice.actions;

export default UserSlice.reducer;
