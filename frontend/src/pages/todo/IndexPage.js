import { Outlet, useNavigate } from 'react-router-dom'
import BasicLayout from '../../layouts/BasicLayout'

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <BasicLayout>
      <div className="m-2 flex w-full p-2">
        <button className="m-1 w-20 p-2 text-center text-xl font-extrabold underline" onClick={() => navigate('list')}>LIST</button>
        <button className="m-1 w-20 p-2 text-center text-xl font-extrabold underline" onClick={() => navigate('add')}>ADD</button>
      </div>
      <div className="flex w-full flex-wrap"><Outlet /></div>
    </BasicLayout>
  )
}
