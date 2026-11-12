import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";

import { getCookie, setCookie, removeCookie } from "../util/cookieUtil";

const initState = {
      email:''
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {

    return loginPost(param)

})

const loadMemberCookie = () => {  //쿠키에서 로그인 정보 로딩 

    const memberInfo =  getCookie("member")

    return memberInfo
}

const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState: loadMemberCookie()|| initState, //쿠키가 없다면 초깃값사용 
    reducers: {
      login: (state, action) => {
        const data = action.payload
        if (data?.accessToken && data?.refreshToken) setCookie("member", JSON.stringify(data), 1)
        return data

      },
      logout: (state, action) => {
          console.log("logout....")

          removeCookie("member")
          return {...initState}
      }
    },
    extraReducers: (builder) => {
      
      builder.addCase( loginPostAsync.fulfilled, (state, action) => { 
        console.log("fulfilled")

        const payload = action.payload

        //정상적인 로그인시에만 저장 
        if(!payload.error){
          setCookie("member",JSON.stringify(payload), 1) //1일
        }

        return payload

      })

      .addCase(loginPostAsync.pending, (state,action) => {
          console.log("pending")
      })
      .addCase(loginPostAsync.rejected, (state,action) => {
          console.log("rejected")
      })
    }
})

export const {login,logout} = loginSlice.actions

export default loginSlice.reducer
