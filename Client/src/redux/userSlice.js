import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  userRole: '',
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.userRole = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.name = '';
      state.userRole = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;