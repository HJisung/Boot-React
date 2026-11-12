import { useEffect } from "react";
import { useState } from "react";
import { modifyMember } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import ResultModal from "../common/ResultModal";

const initState = {
    email: '',
    pw:'', 
    nickname:''
}

const ModifyComponent = () => {

    const [member, setMember] = useState(initState)
    const {loginState: loginInfo, moveToLogin, moveToLoginReturn, doLogout} = useCustomLogin()

    const [result, setResult] = useState()
    const [error, setError] = useState('')

    useEffect(() => {

      setMember({...loginInfo, pw:''})

    },[loginInfo])
    
    const handleChange = (e) => {

      member[e.target.name] = e.target.value

      setMember({...member})

    }

    const handleClickModify = () => {

      setError('')
      modifyMember({email: member.email, pw: member.pw, nickname: member.nickname})
        .then(() => setResult('Modified'))
        .catch(() => setError('수정하지 못했습니다. 입력 내용과 로그인 상태를 확인해 주세요.'))
    }

    const colseModal = () => {
      setResult(null)
      doLogout()
      moveToLogin()
    }

    if (!loginInfo.email) return moveToLoginReturn()

    return (
    <div className="mt-6"> 

      {result? <ResultModal title={'회원정보'} content={'정보수정완료'} callbackFn={colseModal}></ResultModal>:<></>}
      {error && <p className="p-4 text-red-600">{error}</p>}

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Email</div>
          <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
          name="email"
          type={'text'} 
          value={member.email}
          readOnly
          >
          </input>

        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Password</div>
          <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
          name="pw"
          type={'password'} 
          placeholder="변경할 때만 입력"
          value={member.pw}
          onChange={handleChange}
          >
          </input>

        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">Nickname</div>
          <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
          name="nickname"
          type={'text'} 
          value={member.nickname}
          onChange={handleChange}
          >
          </input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap justify-end">
          <button type="button" 
            className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
            onClick={handleClickModify}
          >
            Modify
          </button>  
        </div>
      </div>
      
    </div>
    );
}
 
export default ModifyComponent;
