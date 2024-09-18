import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initialisez l'état de l'utilisateur à partir de localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token:null
};

// Créez un slice pour l'utilisateur
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('token', JSON.stringify(action.payload.token));
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;
