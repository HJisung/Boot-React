import { useState } from 'react'
import { getKakaoLoginLink } from '../../api/kakaoApi'

const KakaoLoginComponent = () => {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleKakaoLogin = async () => {
    setPending(true)
    setError('')
    try {
      const state = crypto.randomUUID()
      const link = await getKakaoLoginLink(state)
      sessionStorage.setItem('kakaoLoginState', state)
      window.location.assign(link)
    } catch (err) {
      setError(err.message || '카카오 로그인 설정을 확인해 주세요.')
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="text-center text-blue-500">로그인시에 자동 가입처리 됩니다</div>
      {error && <p className="text-center text-red-600">{error}</p>}
      <div className="flex w-full justify-center">
        <button type="button" onClick={handleKakaoLogin} disabled={pending}
          className="m-6 w-3/4 rounded bg-yellow-400 p-2 text-center text-3xl font-extrabold text-black shadow-sm">
          {pending ? '연결 중...' : 'KAKAO LOGIN'}
        </button>
      </div>
    </div>
  )
}

export default KakaoLoginComponent
