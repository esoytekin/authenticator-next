import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
} from '@reduxjs/toolkit';
import { RootState } from '..';
import SecretModel from '../../model/secret.model';
import SecretService from '../../service/secret.service';

export const getSecrets = createAsyncThunk(
    'app/secret/getSecrets',
    async (_r, { rejectWithValue }) => {
        const response = await SecretService.get();
        if (response.status !== 200) {
            return rejectWithValue(response.statusText);
        }
        return response.data;
    }
);

export const deleteSecret = createAsyncThunk<string, string>(
    'app/secret/deleteSecret',
    async (id, { rejectWithValue }) => {
        const response = await SecretService.delete(id);
        if (response.status !== 200) {
            return rejectWithValue(response.statusText);
        }
        return id;
    }
);

export const saveSecret = (secret: SecretModel) => (dispatch: any) => {
    if (!secret.id) {
        dispatch(saveNewSecret(secret));
    } else {
        dispatch(updateSecret(secret));
    }
};

const saveNewSecret = createAsyncThunk<SecretModel, SecretModel>(
    'app/secret/saveNewSecret',
    async (secret, { rejectWithValue }) => {
        const response = await SecretService.saveNewSecret(secret);
        if (response.status !== 200) {
            return rejectWithValue(response.statusText);
        }

        secret.id = response.data.id;
        return secret;
    }
);

const updateSecret = createAsyncThunk<SecretModel, SecretModel>(
    'app/secret/updateSecret',
    async (secret, { rejectWithValue }) => {
        const response = await SecretService.updateSecret(secret);

        if (response.status !== 200) {
            return rejectWithValue(response.statusText);
        }

        return secret;
    }
);

const secretAdapter = createEntityAdapter<SecretModel>({
    selectId: s => s.id || s.key,
});

export const { selectAll: selectAllSecrets } = secretAdapter.getSelectors(
    (state: RootState) => state.app.secret.items
);

type SecretSliceProps = {
    loading: boolean;
    items: EntityState<SecretModel>;
    error?: any;
};

const initialState: SecretSliceProps = {
    loading: false,
    items: secretAdapter.getInitialState(),
};

const SecretSlice = createSlice({
    name: 'app/secret',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getSecrets.pending, state => {
            state.loading = true;
            delete state.error;
            secretAdapter.removeAll(state.items);
        });

        builder.addCase(getSecrets.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        builder.addCase(getSecrets.fulfilled, (state, { payload }) => {
            state.loading = false;
            secretAdapter.setAll(state.items, payload);
        });

        builder.addCase(deleteSecret.pending, state => {
            state.loading = true;
            delete state.error;
        });

        builder.addCase(deleteSecret.fulfilled, (state, { payload }) => {
            state.loading = false;
            secretAdapter.removeOne(state.items, payload);
        });

        builder.addCase(deleteSecret.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        builder.addCase(saveNewSecret.pending, state => {
            state.loading = true;
        });

        builder.addCase(saveNewSecret.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        builder.addCase(saveNewSecret.fulfilled, (state, { payload }) => {
            state.loading = false;
            secretAdapter.addOne(state.items, payload);
        });

        builder.addCase(updateSecret.pending, state => {
            state.loading = true;
        });

        builder.addCase(updateSecret.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        builder.addCase(updateSecret.fulfilled, (state, { payload }) => {
            state.loading = false;
            if (payload.id) {
                secretAdapter.updateOne(state.items, {
                    id: payload.id,
                    changes: {
                        key: payload.key,
                        site: payload.site,
                    },
                });
            }
        });
    },
});

export default SecretSlice.reducer;
