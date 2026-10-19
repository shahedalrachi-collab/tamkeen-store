import Footer from "../Components/Footer"

import MyNavBar2 from "../Components/NavBar/MyNavBar2"

import Discount from "../Components/Shared/Discount"
import TopBanner from "../Components/TopBanner"

const CartLayout = ({children}) => {
  return (
    <>
    <TopBanner/>
    <MyNavBar2/>
    <div className="main-background">
      {children}
    </div>
    <Discount/>
      <Footer/>
    </>
  )
}

export default CartLayout

