import { useCallback, useEffect, useState } from "react"

const sendLoginRequest = async (password: string, setPassword: Function, refresh: Function) => {
    fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password }),
    }).then(async () => {
        setPassword('')
        await refresh()
    }).catch((error) => {
        setPassword('')
        console.error(error)
    })
}

const LoginPage = (props: any): JSX.Element => {
    const [password, setPassword] = useState('')
    useEffect(() => {
        async function handleKeyDown(e: any) {
            if (e.key === 'Enter') {
                await sendLoginRequest(password, setPassword, props.refresh)
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [password]);
    return <div>
        <div>
            <h1>PQ Toolkit admin page</h1>
        </div>
        <div>
            <div>
                <span>Hasło:</span>
            </div>
            <div>
                <input style={{ color: 'black' }} type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
            </div>
            <div>
                <button onClick={async () => sendLoginRequest(password, setPassword, props.refresh)}>Zaloguj się
                </button>
            </div>
        </div>
    </div>

}

export default LoginPage
