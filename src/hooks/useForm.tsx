import React, { useState } from 'react'
import { User } from '../utils'


export const useForm = (initialValue: User) => {
    const [formData, setFormData] = useState<User>(initialValue);

    function handleForm(e: React.FormEvent<HTMLInputElement>) {
        const { name, value } = e.target as HTMLInputElement;
        setFormData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
        });
    }

    return {
        formData,
        handleForm
    }
}