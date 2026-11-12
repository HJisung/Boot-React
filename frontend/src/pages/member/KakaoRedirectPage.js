import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { getMemberWithKakaoCode } from '../../api/kakaoApi'
import { login } from '../../slices/loginSlice'
import useCustomLogin from '../../hooks/useCustomLogin'

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams()
  const { moveToPath } = useCustomLogin()
  const dispatch = useDispatch()
  const started = useRef(false)
  const [error, setError] = useState('')
  const authCode = searchParams.get('code')
  const state = searchParams.get('state')

  useEffect(() => {
    if (started.current) return
    started.current = true
    const expected = sessionStorage.getItem('kakaoLoginState')
    sessionStorage.removeItem('kakaoLoginState')
    window.history.replaceState(null, '', '/member/kakao')
    if (!authCode || !state || !expected || state !== expected) {
      setError('카카오 로그인 요청을 확인하지 못했습니다. 다시 로그인해 주세요.')
      return
    }
    getMemberWithKakaoCode(authCode).then((memberInfo) => {
      if (!memberInfo?.accessToken || !memberInfo?.refreshToken) throw new Error('invalid login response')
      dispatch(login(memberInfo))
      moveToPath(memberInfo.social ? '/member/modify' : '/')
    }).catch(() => setError('카카오 로그인에 실패했습니다. 앱 설정과 서버 상태를 확인해 주세요.'))
  }, [authCode, state, dispatch, moveToPath])

  return <div className="p-6">{error || '카카오 로그인 처리 중...'}</div>
}

export default KakaoRedirectPage
