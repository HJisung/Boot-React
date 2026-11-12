import axios from 'axios'
import { API_SERVER_HOST } from './todoApi'

export const getKakaoLoginLink = async (state) => {
  const response = await axios.get(`${API_SERVER_HOST}/api/member/kakao/config`)
  const { configured, restApiKey, redirectUri } = response.data
  if (!configured) throw new Error('카카오 REST API 키가 설정되지 않았습니다.')
  const params = new URLSearchParams({ client_id: restApiKey, redirect_uri: redirectUri, response_type: 'code', state })
  return `https://kauth.kakao.com/oauth/authorize?${params}`
}

export const getMemberWithKakaoCode = async (code) => {
  const response = await axios.post(`${API_SERVER_HOST}/api/member/kakao`, { code })
  return response.data
}
