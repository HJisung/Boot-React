import { atom } from 'recoil'
import { getCookie } from '../util/cookieUtil'
const signinState = atom({
  key: 'signinState',
  default: getCookie('member') || { email: '' },
})
export default signinState
