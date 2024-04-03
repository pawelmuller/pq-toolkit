'use client'

import useSWR from "swr"
import { string } from "zod"
import AdminPage from "../components/admin-page"
import { useState } from "react"
import Loading from "../loading"
import LoginPage from "../components/login-page"
import Header from "@/lib/components/basic/header"
const AdminPageNew = (): JSX.Element => {
    const {
        data: apiData,
        error,
        isLoading,
        mutate
    } = useSWR(`/api/v1/login`)
    if (isLoading) return <Loading />
    if (error != null) return <div><div>Authorization Error</div><div>{error.toString()}</div></div>
    if (apiData === 'Authorized') {
        return <AdminPage refresh={mutate} />
    } else {
        return <LoginPage refresh={mutate} />
    }
}

export default AdminPageNew
