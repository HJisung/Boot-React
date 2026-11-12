import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { cartTotalState } from "../../atoms/cartState";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import CartItemComponent from "../cart/CartItemComponent";

const CartComponent = () => {

    const {isLogin, loginState} = useCustomLogin()

    const {refreshCart, cartItems, changeCart } = useCustomCart()
    const [error, setError] = useState('')

    const total = useRecoilValue(cartTotalState)

    useEffect(() => {

      if(isLogin) {

        refreshCart().then(() => setError('')).catch(() => setError('장바구니를 불러오지 못했습니다.'))
      }

    },[isLogin, loginState.email])

    const handleChangeCart = (item) => {
      changeCart(item).then(() => setError('')).catch(() => setError('장바구니를 변경하지 못했습니다.'))
    }

    return ( 
    <div className="w-full">
      {isLogin ?
      
      <div className="flex flex-col">
        {error && <p className="text-red-700">{error}</p>}
        
        <div className="w-full flex">
          <div className="font-extrabold text-2xl w-4/5">
            {loginState.nickname}'s Cart
          </div>
          <div className="bg-orange-600 text-center text-white font-bold w-1/5 rounded-full m-1">
            {cartItems.length}
          </div>
        </div>

        <div>
          <ul>
            {cartItems.map( item => 
              <CartItemComponent {...item} 
              key={item.cino} 
              changeCart ={handleChangeCart} 
              email={loginState.email}/>)}
          </ul>
        </div>

        <div>
          <div className="text-2xl text-right font-extrabold">
            TOTAL: {total}
          </div>
        </div>

      </div>
      :
      <></>
      }

    </div>
    );
}
 
export default CartComponent;
