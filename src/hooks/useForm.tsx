import React, { useState } from 'react'
import { User } from '../utils'


type handleFormParameter =  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
export const useForm = (initialValue: User) => {
    const [formData, setFormData] = useState<User>(initialValue);

    function handleForm(e: handleFormParameter) {
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