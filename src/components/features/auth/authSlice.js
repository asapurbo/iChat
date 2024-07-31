import { createSlice } from '@reduxjs/toolkit'

// initial state
const initialState = {
    accessToken: null,
    user: {}
}

const authSlice = createSlice({
    name: 'auth_slice',
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user
        },
        logOut: (state) => {
            state.accessToken = null;
            state.user = {}
        },
    }
})

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;