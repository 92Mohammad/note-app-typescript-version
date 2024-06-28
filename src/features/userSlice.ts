import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { BASE_URL, User } from "../utils";

export interface UserState {
    isLogin: boolean;
    isSignUp: boolean;
    isLogout: boolean;
}

const initialState: UserState = {
    isLogin: false,
    isSignUp: false,
    isLogout: true
}

export const UserLogin =  createAsyncThunk('/user/login', async(user: User) => {
    try {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        const data = await res.json();
        return data;
    }
    catch(error: any){
        console.log(error.message);
    }
})


export const UserSignup = createAsyncThunk('/user/signup', async(newUser: User) => {
     try {
            const res = await fetch(`${BASE_URL}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            const data = await res.json();
            console.log(data);

            return data;
        }
        catch(error: any ){
            console.log(error.message);
        }

})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(UserLogin.pending, () => {
                console.log('pending')
            })
            .addCase(UserLogin.fulfilled, (state, action) => {
                const messageType = action.payload.messageType
                if (messageType === 'success'){
                    state.isLogin = true;
                    const token = action.payload.jwtToken;
                    localStorage.setItem('authToken', token);   
                }
                else{
                    console.log("Error message : ", messageType)
                }
            })
            .addCase(UserLogin.rejected, () => {
                console.log("rejected")
            })
            .addCase(UserSignup.pending, () => {
                console.log("pending status")
            })
            .addCase(UserSignup.fulfilled, (state, action) => {
                const messageType = action.payload.messageType;
                if (messageType == "success"){
                    state.isSignUp = true;
                }
                else {
                    console.log("message: ", action.payload)
                }
            })
            .addCase(UserSignup.rejected, () => {
                console.log("Rejected status")
            })
    }
})

export default userSlice.reducer;



