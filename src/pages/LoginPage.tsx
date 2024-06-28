
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from '../hooks/useForm'
import { useNavigate } from 'react-router-dom';
import { UserLogin } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { useEffect } from 'react';

export const LoginPage = () => {

    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { isLogin } = useSelector((state: RootState)=> state.users)

    
    const {formData, handleForm} = useForm({
        username: '',
        password: ''
    })
    
    useEffect(() => {
        if (isLogin){
            // dispatch(setLogin(false));
            navigate('/notes') 
        }

    }, [dispatch, navigate, isLogin])


    return (
        <main className="bg-gray-950 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center flex-col gap-4">
            <h1 className="flex items-center text-3xl text-white font-medium ">Please LogIn</h1>
            <div className='bg-white px-4 py-8 w-[500px] flex flex-col gap-4 rounded-lg'>
                <TextField 
                    required
                    id="outlined-basic" 
                    name = 'username'
                    fullWidth
                    label="Username"
                    variant="outlined" 
                    value = {formData.username}
                    onChange = {(e) => handleForm(e)}
                />
                <TextField 
                    required
                    name = 'password'
                    id="outlined-basic" 
                    fullWidth
                    label="Password..."
                    value = {formData.password}
                    variant="outlined" 
                    onChange = {(e) => handleForm(e)}
                />
                <Button 
                    variant="contained"
                    size='large'
                    fullWidth
                    onClick = {() => dispatch(UserLogin(formData))}
                >
                    Login
                </Button>
            </div>
        </main>
    )
}