
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from '../hooks/useForm'
import { useNavigate} from 'react-router-dom'
import { UserSignup } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { useEffect } from 'react'


export const SignUpPage = () => {

    const dispatch: AppDispatch = useDispatch();
    const { isSignUp } = useSelector((state: RootState) => state.users)
    
    const { formData, handleForm } = useForm({
        username: "",
        email: "",
        password: "",
    })
    const navigate = useNavigate();
    
    useEffect(() => {

        if (isSignUp ){
            // dispatch(setSignup(false));
            navigate('/login');
        }

    }, [dispatch,isSignUp , navigate])
    

    return (
        <main className="bg-gray-950 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center flex-col gap-4">
            
            <h1 className="flex items-center text-3xl text-white font-medium ">Please SignUp</h1>
            <div className='bg-white px-4 py-8 w-[500px] flex flex-col gap-4 rounded-lg'>
                <TextField 
                    required
                    id="outlined-basic" 
                    name = 'username'
                    fullWidth 
                    label="Username"
                    variant="outlined" 
                    value = {formData.username}
                    onChange={(e) => handleForm(e)}
                />
                <TextField 
                    required
                    id="outlined-basic" 
                    name = 'email'
                    fullWidth 
                    label="Email"
                    variant="outlined" 
                    value = {formData.email}
                    onChange={(e) => handleForm(e)}
                />
                <TextField 
                    required    
                    id="outlined-basic" 
                    name = 'password'
                    fullWidth 
                    label="Password"
                    variant="outlined" 
                    value = {formData.password}
                    onChange = {(e) => handleForm(e)}
                />
                <Button 
                    variant="contained"
                    size='large'
                    onClick = {() => dispatch(UserSignup(formData))}
                >
                    SignUp
                </Button>
            </div>
        </main>

    )
}