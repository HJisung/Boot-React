import axios from 'axios'
import { getCookie, setCookie, removeCookie } from './cookieUtil'
import { API_SERVER_HOST } from '../api/todoApi'

const jwtAxios = axios.create()
let refreshRequest = null

const loginRequired = () => ({ response: { data: { error: 'REQUIRE_LOGIN' } } })

const refreshJWT = async (accessToken, refreshToken) => {
  const res = await axios.get(`${API_SERVER_HOST}/api/member/refresh`, {
    params: { refreshToken },
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}

const beforeReq = (config) => {
  const memberInfo = getCookie('member')
  if (!memberInfo?.accessToken) return Promise.reject(loginRequired())

  config.headers.Authorization = `Bearer ${memberInfo.accessToken}`
  return config
}

const requestFail = (error) => Promise.reject(error)

const beforeRes = async (res) => {
  if (res.data?.error !== 'ERROR_ACCESS_TOKEN') return res

  const member = getCookie('member')
  if (!member?.accessToken || !member.refreshToken) return Promise.reject(loginRequired())

  try {
    if (!refreshRequest) {
      refreshRequest = refreshJWT(member.accessToken, member.refreshToken)
        .finally(() => { refreshRequest = null })
    }
    const result = await refreshRequest
    if (!result.accessToken || !result.refreshToken || getCookie('member')?.refreshToken !== member.refreshToken) {
      throw loginRequired()
    }
    member.accessToken = result.accessToken
    member.refreshToken = result.refreshToken
    setCookie('member', JSON.stringify(member), 1)

    const originalRequest = res.config
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`
    const retried = await axios(originalRequest)
    if (retried.data?.error === 'ERROR_ACCESS_TOKEN') throw loginRequired()
    return retried
  } catch (error) {
    removeCookie('member')
    return Promise.reject(error?.response?.data?.error ? error : loginRequired())
  }
}

const responseFail = (error) => Promise.reject(error)

jwtAxios.interceptors.request.use(beforeReq, requestFail)
jwtAxios.interceptors.response.use(beforeRes, responseFail)

export default jwtAxios
