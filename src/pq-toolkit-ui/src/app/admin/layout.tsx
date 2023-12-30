import { SWRConfigProvider } from '@/core/apiHandlers/clientApiHandler'

const AdminApiWrapper = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  return <SWRConfigProvider>{children}</SWRConfigProvider>
}

export default AdminApiWrapper
