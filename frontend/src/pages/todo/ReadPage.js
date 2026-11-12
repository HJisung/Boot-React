import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'

export default function ReadPage() {
  const { tno } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const page = params.get('page') || '1'
  const size = params.get('size') || '10'
  const search = createSearchParams({ page, size }).toString()

  return (
    <div className="text-3xl font-extrabold">
      Todo Read Page Component {tno}
      <div>
        <button onClick={() => navigate({ pathname: `/todo/modify/${tno}`, search })}>Test Modify</button>{' '}
        <button onClick={() => navigate({ pathname: '/todo/list', search })}>Test List</button>
      </div>
    </div>
  )
}
