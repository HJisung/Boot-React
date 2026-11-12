import axios from "axios"
import { API_SERVER_HOST } from "./todoApi"

const host = `${API_SERVER_HOST}/api/member`

export const loginPost = async (loginParam) => {

    const form = new URLSearchParams({ username: loginParam.email, password: loginParam.pw })
    const res = await axios.post(`${host}/login`, form)

    return res.data

}
