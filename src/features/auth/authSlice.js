import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem("user");
const tokenFromStorage = localStorage.getItem("accessToken");

const initialState = {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage || null,
    isAuthenticated: !!tokenFromStorage,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, tokens } = action.payload;

            // Optional: sanitize user (recommended)
            const safeUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles || [],
            };

            state.user = safeUser;
            state.token = tokens.access.token;
            state.isAuthenticated = true;

            // LocalStorage
            localStorage.setItem("user", JSON.stringify(safeUser));
            localStorage.setItem("accessToken", tokens.access.token);
            localStorage.setItem("refreshToken", tokens.refresh.token);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
