import Footer from "../Components/Footer"
import MyNavBar from "../Components/NavBar/MyNavBar"
import TopBanner from "../Components/TopBanner"

const PageLayout = ({children}) => {
  return (
    <>
    <TopBanner/>
    <MyNavBar/>
    <div className="main-background">
      {children}
    </div>
    <Footer/>

    </>
  )
}

export default PageLayout