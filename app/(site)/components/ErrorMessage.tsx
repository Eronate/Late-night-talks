import { FieldError, FieldValues } from "react-hook-form"

interface IErrorMessage {
    errors?: FieldError
}

export default function ErrorMessage({errors}: IErrorMessage) {
    if(!errors)
        return <></>
    const style = "text-red-500 text-xs"
    const isRequiredError = errors.type === 'too_small'
    const requiredMessage = errors.message 
    const otherErrors = Object.values(errors.types || {}).flat()
    console.log(otherErrors)
    return (
        <div>
            {
                isRequiredError ? 
                <p className={style}>{requiredMessage}</p> : 
                otherErrors.map(err => <p className={style} key={err as string}>{err}</p>)
            }
        </div>
    )
}
