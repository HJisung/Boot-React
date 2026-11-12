import axios from "axios"
import { API_SERVER_HOST } from "./todoApi"
import jwtAxios from '../util/jwtUtil'

const host = `${API_SERVER_HOST}/api/member`

export const loginPost = async (loginParam) => {

    const form = new URLSearchParams({ username: loginParam.email, password: loginParam.pw })
    const res = await axios.post(`${host}/login`, form)

    return res.data

}

export const modifyMember = async (member) => {
    const modifyHost = import.meta.env.VITE_MEMBER_API_HOST || API_SERVER_HOST
    const res = await jwtAxios.put(`${modifyHost}/api/member/modify`, member)
    return res.data
}
