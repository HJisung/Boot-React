import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartItems, postChangeCart } from "../api/cartApi";
import { login, loginPostAsync, logout } from './loginSlice';

export const getCartItemsAsync = createAsyncThunk('getCartItemsAsync', async (_, { getState, rejectWithValue }) => {
    const email = getState().loginSlice.email
    const result = await getCartItems()
    return email && getState().loginSlice.email === email ? result : rejectWithValue('LOGIN_CHANGED')
})

export const postChangeCartAsync = createAsyncThunk('postCartItemsAsync', async (param, { getState, rejectWithValue }) => {
    const result = await postChangeCart(param)
    return getState().loginSlice.email === param.email ? result : rejectWithValue('LOGIN_CHANGED')
})

const initState = []

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState: initState,

    extraReducers: (builder) => {
      builder.addCase( 
        getCartItemsAsync.fulfilled, (state, action) => { 
          console.log("getCartItemsAsync fulfilled")

          return action.payload
        }
      )
      .addCase(logout, () => [])
      .addCase(login, () => [])
      .addCase(loginPostAsync.fulfilled, () => [])
      .addCase(
        postChangeCartAsync.fulfilled, (state, action) => {

          console.log("postCartItemsAsync fulfilled")

          return action.payload
        }
      )
    }
})

export default cartSlice.reducer
