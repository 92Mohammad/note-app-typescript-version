import express from 'express'
import jwt from "jsonwebtoken";
const router = express.Router();
import bcrypt from 'bcrypt'
import auth from '../middleware/jwtAuthenticate'
import User from '../models/user.model'


interface SignUp {
    _id: string,
    username: string,
    email: string,
    password: string
}

interface Login {
    _id: string,
    username: string,
    password: string
}


router.post('/signup', async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({userName: username}) as SignUp;
        if (!user){
            //add new user to database
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({
                userName: username,
                email: email,
                password: hashedPassword
            })
            return res.status(201).json({ message: 'User created successfully'})
        }
        if (user){
            return res.status(409).json({message: 'User name already exist'} );
        }

    }
    catch(error: any) {
        return res.status(500).json({error: error.message})
    }
})


router.post('/login', async (req, res) => {

    const { username, password } = req.body

    try {
        const user = await User.findOne({ userName: username}) as Login;

        if (!user){
            return res.status(402).json( { message: "User Not found"});
        }
        else {
            const matchPassword = await bcrypt.compare(password, user.password)
            if (matchPassword){
                console.log()
                const token = jwt.sign({ userId: user._id } , process.env.JWT_SECRET!, { expiresIn: '1d'} )
                return res.status(201).json({message: 'login successfully' ,  jwtToken: token })
            }
        }
    }
    catch(error: any){
        return res.status(500).json({ error: error.message})
    }
})


router.post('/logout', auth, (req, res) => {

    return res.status(200).json({ message: 'Successfully logout'})


    // const token = req.headers["authorization"]
    // // put the token in invalidate token so that in future any one access it will not be able to access the private content
    // const sql = "INSERT INTO expireTokens(invalidToken) VALUE(?)"
    // connection.query(sql, [token], (err, results) => {
    //     if (err) {
    //         console.log("Failed query : ", err.message)
    //     }
    //     else {
    //         return res.status(200).send({ message: "LogOut successfully" })
    //
    //     }
    // })

})



export default router;