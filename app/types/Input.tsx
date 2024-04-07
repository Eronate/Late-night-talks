import { FieldValues, RegisterOptions, UseFormRegister, FieldErrors, FieldError } from "react-hook-form"

export interface InputProps {
    label: string
    register: UseFormRegister<FieldValues>
    required?: boolean
    placeholder?: string
    options?: RegisterOptions<FieldValues, string>
    disabled?: boolean,
    errors?: FieldError
}
