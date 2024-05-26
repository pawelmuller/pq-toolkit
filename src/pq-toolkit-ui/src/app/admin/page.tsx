'use client'

import useSWR from "swr"
import AdminPage from "../components/admin-page"
import Loading from "../loading"
import LoginPage from "../components/login-page"
import { authorizedFetch } from "@/core/apiHandlers/fetchers"
import { type UserData } from "@/lib/schemas/authenticationData"

const AdminPageNew = (): JSX.Element => {
    const {
        data: apiData,
        error,
        isLoading,
        mutate
    } = useSWR<UserData>(`/api/v1/auth/user`, authorizedFetch)
    if (isLoading) return <Loading />
    if (error != null) return <div><div>Authorization Error</div><div>{error.toString()}</div></div>
    if ((apiData?.is_active) ?? false) {
        return <AdminPage refresh={mutate} />
    } else {
        return <LoginPage refreshAdminPage={mutate} />
    }
}

export default AdminPageNew
