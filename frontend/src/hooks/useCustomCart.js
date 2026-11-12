import { useRecoilState } from 'recoil'
import { cartState } from '../atoms/cartState'
import { getCartItems, postChangeCart } from '../api/cartApi'
import { getCookie } from '../util/cookieUtil'

const useCustomCart = () => {
  const [cartItems, setCartItems] = useRecoilState(cartState)
  const updateForMember = async (request, email) => {
    const result = await request
    if (!email || getCookie('member')?.email !== email) throw new Error('LOGIN_CHANGED')
    setCartItems(result)
    return result
  }
  const refreshCart = () => updateForMember(getCartItems(), getCookie('member')?.email)
  const changeCart = (param) => updateForMember(postChangeCart(param), param.email)
  return { cartItems, refreshCart, changeCart }
}
export default useCustomCart
