import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {}
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue } //dispatch : 액션 , rejectWithValue : 오류 payload를 반환, 서버에서 받은 특정 정보를 제공
  ) => {
    try{
      const response = await api.post("/user/register", {email, name, password});
      //성공
      //1. 성공 토스트 메세지 보여주기
      dispatch(showToastMessage({message:"회원가입을 성공했습니다!", status:"success"}));
      //2. 로그인 페이지로 리다이렉트
      navigate('/login');

      return response.data.data;
    }catch(error){
      //실패
      //1. 실패 토스트 메세지를 보여준다.
      
      dispatch(showToastMessage({message:"회원가입에 실패 했습니다.", status:"error"}));
      //2. 에러값을 저장한다.
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state)=>{
        state.loading=true;
    })
    .addCase(registerUser.fulfilled, (state)=>{
      state.loading=false;
      state.registrationError=null;
    })
    .addCase(registerUser.rejected, (state, action)=>{
      state.registrationError = action.payload
    })
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
