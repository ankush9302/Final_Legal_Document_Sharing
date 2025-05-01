import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import batchReducer from './batchSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    batch : batchReducer
  },
});