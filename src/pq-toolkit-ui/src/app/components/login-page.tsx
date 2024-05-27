'use client'

import { useEffect, useState } from "react"
import Header from "@/lib/components/basic/header"
import Blobs from "./blobs"
import { loginFetch } from "@/core/apiHandlers/fetchers"
import { LoginSchema, type UserData } from "@/lib/schemas/authenticationData"
import { type KeyedMutator } from "swr"

const LoginPage = ({
    refreshAdminPage
}: {
    refreshAdminPage: KeyedMutator<UserData>
}): JSX.Element => {
    const [password, setPassword] = useState('')
    const [errorRequest, setErrorRequest] = useState(false)
    useEffect(() => {
        async function handleKeyDown(e: any): Promise<undefined> {
            if (e.key === 'Enter') {
                void loginFetch(password, LoginSchema).then(async response => {
                    const accessToken = response.access_token
                    localStorage.setItem('token', accessToken);
                    setPassword('')
                    setErrorRequest(false)
                    await refreshAdminPage()
                }).catch()

            }
        }
        document.addEventListener('keydown', (event) => { handleKeyDown(event).catch(err => { console.error(err) }) });
        return function cleanup(): void {
            document.removeEventListener('keydown', (event) => { handleKeyDown(event).catch(err => { console.error(err) }) });
        }
    }, [password]);
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-stone-900">
            <Header />
            <div className="flex flex-col h-full w-full items-center justify-center my-auto mt-40">
                <div className="relative text-center mb-sm">
                    <Blobs />
                    <div className="fadeInUp">
                        <h1 className="relative text-5xl md:text-6xl font-bold">Perceptual Qualities Toolkit</h1>
                        <h2 className="relative text-2xl md:text-3xl font-semibold mt-sm">
                            Admin login page
                        </h2>
                    </div>
                </div>
                <div className="flex content-center bg-gray-50 dark:bg-stone-800 rounded-2xl justify-center fadeInUp z-10 p-3 mt-4 md:mt-8">
                    <div className="flex flex-col justify-center content-center">
                        <div className="mt-2">
                            <input className={`rounded outline-0 border-2 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white text-black ${errorRequest ? 'border-red-800' : ''}`} type='password' value={password} onChange={e => {
                                setErrorRequest(false)
                                setPassword(e.target.value)
                            }}></input>
                        </div>
                        {errorRequest ? <span className=" text-red-700 text-xs m-0 p-0 h-2 ml-1">Wrong password</span> : <span className="h-2" />}
                        <div className="flex justify-center content-center mt-3">
                            <div className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-cyan-500  to-pink-500 cursor-pointer" onClick={() => {
                                void (async () => {
                                    try {
                                        void loginFetch(password, LoginSchema).then(async response => {
                                            const accessToken = response.access_token
                                            localStorage.setItem('token', accessToken);
                                            setPassword('')
                                            setErrorRequest(false)
                                            await refreshAdminPage()
                                        }).catch()
                                    } catch (error) {
                                        console.error(error);
                                    }
                                })();
                            }}>Login</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default LoginPage
