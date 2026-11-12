import axios from 'axios'
import { API_SERVER_HOST } from './todoApi'

const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY
const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:5173/member/kakao'
export const kakaoMockUrl = import.meta.env.VITE_KAKAO_MOCK_URL

export const getKakaoLoginLink = (state) => {
  if (!restApiKey) return null
  const params = new URLSearchParams({ client_id: restApiKey, redirect_uri: redirectUri, response_type: 'code', state })
  return `https://kauth.kakao.com/oauth/authorize?${params}`
}

export const getMemberWithKakaoCode = async (code) => {
  const response = await axios.post(`${API_SERVER_HOST}/api/member/kakao`, { code })
  return response.data
}

export const getMockKakaoMember = async () => {
  const response = await axios.post(`${kakaoMockUrl}/mock/kakao`)
  return response.data
}
