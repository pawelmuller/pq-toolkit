'use client'

import useSWR from "swr"
import AdminPage from "../components/admin-page"
import Loading from "../loading"
import LoginPage from "../components/login-page"
const AdminPageNew = (): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetcher = async (url: string): Promise<any> => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        return await response.json();
    };
    const {
        data: apiData,
        error,
        isLoading,
        mutate
    } = useSWR(`/api/v1/auth/user`, fetcher)
    if (isLoading) return <Loading />
    if (error != null) return <div><div>Authorization Error</div><div>{error.toString()}</div></div>
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (apiData.is_active) {
        return <AdminPage refresh={mutate} />
    } else {
        return <LoginPage refresh={mutate} />
    }
}

export default AdminPageNew
