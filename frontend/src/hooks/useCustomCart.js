import { useDispatch, useSelector } from "react-redux"
import { getCartItemsAsync, postChangeCartAsync } from "../slices/cartSlice"

const useCustomCart = () => {

    const cartItems = useSelector(state => state.cartSlice)

    const dispatch = useDispatch()

    const refreshCart = () => {

      return dispatch(getCartItemsAsync()).unwrap()

    }

    const changeCart = (param) => {

      return dispatch(postChangeCartAsync(param)).unwrap()
    }

    return  {cartItems,  refreshCart, changeCart}

}

export default useCustomCart
