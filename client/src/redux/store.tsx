import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import { userReducer } from './user/userSlice';
import { themeReducer } from "./theme/themeSlice";

const rootReducer = combineReducers({
    userSlice: userReducer, 
    themeSlice: themeReducer,
});
const persistConfig = {
    key: 'root',
    storage,      //using localStorage
    version: 1
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    // middleware to prevent some serialize error
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;