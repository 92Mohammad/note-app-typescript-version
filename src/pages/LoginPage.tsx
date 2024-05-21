
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from '../hooks/useForm'
import { User } from '../utils';
import { useNavigate } from 'react-router-dom';


export const LoginPage = () => {

    const navigate = useNavigate();
    
    const {formData, handleForm} = useForm({
        username: '',
        password: ''
    })
    

    const UserLogin = async() => {
        try {
           const user: User = formData;
           const res = await fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
           })

           const data = await res.json();
           if (res.status === 201){
                localStorage.setItem('authToken', data.jwtToken);
                navigate('/notes') 
           }
           console.log(data);
        }
        catch(error: any){
            console.log(error.message);
        }
    }


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
                    onClick = {() => UserLogin()}
                >
                    Login
                </Button>
            </div>
        </main>
    )
}