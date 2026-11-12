import { atom, selector } from 'recoil'
export const cartState = atom({ key: 'cartState', default: [] })
export const cartTotalState = selector({
  key: 'cartTotalState',
  get: ({ get }) => get(cartState).reduce((total, item) => total + item.price * item.qty, 0),
})
