import { getApiDocs } from '@/app/api/v1/swagger'
import ReactSwagger from './react-swagger'

export default async function IndexPage(): Promise<JSX.Element> {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="text-black">
        API docs are not available in production mode.
      </div>
    )
  }

  const spec = await getApiDocs()
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  )
}
