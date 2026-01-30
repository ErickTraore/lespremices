// frontend/src/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import messageReducer from './reducers/messageReducer';
import userReducer from './reducers/userReducer';
import profileInfoReducer from './reducers/profileInfoReducer';
import profileMediaReducer from './reducers/profileMediaReducer';
import presseLocaleReducer from './reducers/presseLocaleReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer,
    user: userReducer,
    profileInfo: profileInfoReducer,
    profileMedia: profileMediaReducer,
    presseLocale: presseLocaleReducer,
  }
});

export default store;

