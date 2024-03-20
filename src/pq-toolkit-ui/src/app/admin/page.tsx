'use client'

import useSWR from "swr"
import { string } from "zod"
import AdminPage from "../components/admin-page"
import { useState } from "react"


const AdminPageNew = (): JSX.Element => {
    const {
        data: apiData,
        error,
        isLoading,
        mutate
    } = useSWR(`/api/v1/login`)
    const [password, setPassword] = useState('')
    if (isLoading) return <div>loading</div>
    if (error != null) return <div>error</div>
    if (apiData === 'Authorized') {
        return <AdminPage refresh={mutate} />
    } else {
        return <div><input style={{color:'black'}} value={password} onChange={e=>setPassword(e.target.value)}></input>
            <div onClick={async () => {
            fetch("/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: password}),
            }).then(async () => {
                setPassword('')
                await mutate()
            }).catch(() => {
                setPassword('')
                console.error
            })
        }}>Zaloguj się</div></div>
    }
}

export default AdminPageNew
