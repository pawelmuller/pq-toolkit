'use client'

import useSWR from "swr"
import AdminPage from "../components/admin-page"
import Loading from "../loading"
import LoginPage from "../components/login-page"
import { userFetch } from '@/lib/utils/fetchers'
import { type UserData } from "@/lib/schemas/apiResults"


const AdminPageNew = (): JSX.Element => {
    const {
        data: apiData,
        error,
        isLoading,
        mutate
    } = useSWR<UserData>(`/api/v1/auth/user`, userFetch)
    if (isLoading) return <Loading />
    if (error != null)
        if (error.message.includes("\"status\":401") as boolean) {
            return <LoginPage refreshAdminPage={mutate} />
        } else
            return <div><div>Authorization Error</div><div>{error.toString()}</div></div>
    if ((apiData?.is_active) ?? false) {
        return <AdminPage refreshAdminPage={mutate} />
    } else {
        return <LoginPage refreshAdminPage={mutate} />
    }
}

export default AdminPageNew
