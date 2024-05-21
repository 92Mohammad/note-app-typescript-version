
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from '../hooks/useForm'
import { User } from '../utils';
import { useNavigate} from 'react-router-dom'

export const SignUpPage = () => {

    const { formData, handleForm } = useForm({
        username: "",
        email: "",
        password: "",
    })
    const navigate = useNavigate();

    const UserSignUP = async() => {

        try {
            const newUser: User = formData;
            const res = await fetch('http://localhost:8000/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            const data = await res.json();
            console.log(data);
            if (res.status === 201){
                navigate('/login');
                console.log(data.message);
            }
        }
        catch(error: any ){
            console.log(error.message);
        }
    }
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
                    onClick = {() => UserSignUP()}
                >
                    SignUp
                </Button>
            </div>
        </main>

    )
}