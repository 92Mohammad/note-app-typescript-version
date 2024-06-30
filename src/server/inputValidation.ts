import { string, z,  } from 'zod'
import {  Login,  SignUp } from '../server/routes/userRoute'


interface TabInput {
    noteId: string
}
const LoginInput = z.object({
    username: string().min(3).max(15),
    password: string().min(5).max(15)
})

const SignUpInput = LoginInput.extend({
    email: string().email().max(20)
})

const createTabInput = z.object({
    noteId: string(),
    title: string().min(2)
})


export const validateSignUpInput = (input: SignUp) => {
    const paresdSignUpInput = SignUpInput.safeParse(input)
    return paresdSignUpInput;
}

export const validateLoginInput = (input: Login) => {
    const parsedLoginInput = LoginInput.safeParse(input);
    return parsedLoginInput;

}

export const validateTabInput = (tabInput: TabInput) => {
    const parsedData = createTabInput.safeParse(tabInput);
    return parsedData;
}

export const env = z.object({
    DB_STRING: string()
}).parse({ DB_STRING: process.env.DB_STRING})
