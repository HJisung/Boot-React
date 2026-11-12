import LoginComponent from "../../components/member/LoginComponent";
import BasicMenu from "../../components/menus/BasicMenu";
import KakaoLoginComponent from "../../components/member/KakaoLoginComponent";

const LoginPage = () => {
    return ( 
      <div className='fixed top-0 left-0 z-[1055] flex flex-col h-full w-full'>

        <BasicMenu/>

        <div className="w-full flex flex-wrap  h-full justify-center  items-center border-2">
          <div className="w-full max-w-xl">
            <LoginComponent/>
            <KakaoLoginComponent/>
          </div>
        </div>  
      </div>
     );
}
 
export default LoginPage;
