import { configureStore } from '@reduxjs/toolkit';
import labelsReducer from './labelSlice';

export const store:any = configureStore({
  reducer: {
    labels: labelsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
