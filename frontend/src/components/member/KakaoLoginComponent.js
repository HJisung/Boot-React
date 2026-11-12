import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getKakaoLoginLink, getMockKakaoMember, kakaoMockUrl } from '../../api/kakaoApi'
import { login } from '../../slices/loginSlice'

const KakaoLoginComponent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleKakaoLogin = async () => {
    if (kakaoMockUrl) {
      try {
        const member = await getMockKakaoMember()
        if (!member?.accessToken || !member?.refreshToken) throw new Error('mock login failed')
        dispatch(login(member))
        navigate('/member/modify')
      } catch {
        alert('실습용 모의 서버에 연결하지 못했습니다.')
      }
      return
    }
    const state = crypto.randomUUID()
    const link = getKakaoLoginLink(state)
    if (!link) {
      alert('카카오 REST API 키를 먼저 설정해 주세요.')
      return
    }
    sessionStorage.setItem('kakaoLoginState', state)
    window.location.assign(link)
  }

  return (
    <div className="flex flex-col">
      {kakaoMockUrl && <div className="text-center text-sm text-gray-600">실습 모드: 카카오 로그인을 모의합니다.</div>}
      <div className="text-center text-blue-500">로그인시에 자동 가입처리 됩니다</div>
      <div className="flex w-full justify-center">
        <button type="button" onClick={handleKakaoLogin}
          className="m-6 w-3/4 rounded bg-yellow-400 p-2 text-center text-3xl font-extrabold text-black shadow-sm">
          KAKAO LOGIN
        </button>
      </div>
    </div>
  )
}

export default KakaoLoginComponent
