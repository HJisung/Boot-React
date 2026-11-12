import { Navigate, createSearchParams, useNavigate } from 'react-router-dom'
import { useRecoilState, useResetRecoilState } from 'recoil'
import signinState from '../atoms/signinState'
import { cartState } from '../atoms/cartState'
import { loginPost } from '../api/memberApi'
import { removeCookie, setCookie } from '../util/cookieUtil'

const useCustomLogin = () => {
  const navigate = useNavigate()
  const [loginState, setLoginState] = useRecoilState(signinState)
  const resetCartState = useResetRecoilState(cartState)
  const isLogin = !!loginState.email
  const saveAsCookie = (data) => {
    setCookie('member', JSON.stringify(data), 1)
    resetCartState()
    setLoginState(data)
  }
  const doLogin = async (loginParam) => {
    const result = await loginPost(loginParam)
    if (!result.error && result.accessToken && result.refreshToken) saveAsCookie(result)
    return result
  }
  const doLogout = () => {
    removeCookie('member')
    setLoginState({ email: '' })
    resetCartState()
  }
  const exceptionHandle = (ex) => {
    const errorMsg = ex?.response?.data?.error || 'SERVER_ERROR'
    const errorStr = createSearchParams({ error: errorMsg }).toString()
    if (errorMsg === 'REQUIRE_LOGIN') {
      doLogout()
      alert('로그인 해야만 합니다.')
      navigate({ pathname: '/member/login', search: errorStr })
      return
    }
    if (errorMsg === 'ERROR_ACCESSDENIED') {
      alert('해당 메뉴를 사용할 수 있는 권한이 없습니다.')
      navigate({ pathname: '/member/login', search: errorStr })
      return
    }
    if (errorMsg === 'SERVER_ERROR') alert('서버에 연결할 수 없습니다.')
  }
  const moveToPath = (path) => navigate({ pathname: path }, { replace: true })
  const moveToLogin = () => navigate({ pathname: '/member/login' }, { replace: true })
  const moveToLoginReturn = () => <Navigate replace to="/member/login" />
  return { loginState, isLogin, doLogin, doLogout, saveAsCookie, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle }
}
export default useCustomLogin
