import { useCallback, useEffect, useState } from "react"
import Header from "@/lib/components/basic/header"
const sendLoginRequest = async (password: string, setPassword: Function, refresh: Function, setErrorRequest: Function) => {
    fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password }),
    }).then(async (e) => {
        setPassword('')
        if (e.ok) {
            setErrorRequest(false)
            await refresh()
        }
        else {
            setErrorRequest(true)
        }

    }).catch((error) => {
        setPassword('')
    })
}

const LoginPage = (props: any): JSX.Element => {
    const [password, setPassword] = useState('')
    const [errorRequest, setErrorRequest] = useState(false)
    useEffect(() => {
        async function handleKeyDown(e: any) {
            if (e.key === 'Enter') {
                await sendLoginRequest(password, setPassword, props.refresh, setErrorRequest)
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [password]);
    return <div className="min-h-screen bg-gray-100">
        <Header>
            <div className="flex flex-col h-full w-full items-center justify-center my-auto fadeInUp mt-40">
                <div className="relative text-center mb-md">
                    <div className='absolute -top-14 right-36 w-80 h-80 bg-gradient-to-r from-pink-700 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000' />
                    <div className='absolute -top-14 left-36 w-80 h-80 bg-gradient-to-r from-cyan-600 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-6000' />
                    <div className='absolute top-10 right-64 w-80 h-80 bg-gradient-to-r from-pink-500 to-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000' />
                    <div className='absolute -top-28 -right-6 w-96 h-96 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-8000' />
                    <div className='absolute -top-24 -left-11 w-96 h-96 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-10000' />
                    <h1 className="relative text-6xl font-bold">PQ Toolkit Admin Page</h1>
                </div>
                <div className="flex content-center bg-white rounded justify-center z-10 p-3 mt-10">
                    <div className="flex flex-col justify-center content-center">
                        <div className="mt-2">
                            <input className={`rounded outline-0 border-2 bg-gray-200 text-black ${errorRequest ? 'border-red-800' : ''}`} type='password' value={password} onChange={e => {
                                setErrorRequest(false)
                                setPassword(e.target.value)
                            }}></input>
                        </div>
                        {errorRequest ? <span className=" text-red-700 text-xs m-0 p-0 h-2 ml-1">Wrong password</span> : <span className="h-2" />}
                        <div className="flex justify-center content-center mt-3">
                            <div className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-cyan-500  to-pink-500 cursor-pointer" onClick={async () => sendLoginRequest(password, setPassword, props.refresh, setErrorRequest)}>Login</div>
                        </div>
                    </div>
                </div>
            </div>
        </Header>
    </div>

}

export default LoginPage
