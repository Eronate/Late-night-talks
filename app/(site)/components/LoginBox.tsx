interface LoginBoxProps {
    text: string
    children: React.ReactNode
}

const LoginBox = ({text, children}: LoginBoxProps ) => {
    return (
        <div className="flex flex-col mt-4 gap-1">
            <div className="flex text-xs text-gray-700">
                {text}
            </div>
           {children}
        </div>
    )
}

export default LoginBox