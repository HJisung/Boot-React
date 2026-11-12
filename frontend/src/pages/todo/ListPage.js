import { useSearchParams } from 'react-router-dom'

export default function ListPage() {
  const [queryParams] = useSearchParams()
  const page = queryParams.get('page') ? parseInt(queryParams.get('page'), 10) : 1
  const size = queryParams.get('size') ? parseInt(queryParams.get('size'), 10) : 10

  return (
    <div className="w-full bg-white p-4">
      <div className="text-3xl font-extrabold">Todo List Page Component {page} --- {size}</div>
    </div>
  )
}
