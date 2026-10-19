import MyNavBar2 from "../Components/NavBar/MyNavBar2"
import TopBanner from "../Components/TopBanner"

const SettingLayout = ({children}) => {
  return (  <>
    <TopBanner/>
    <MyNavBar2/>
    <div className="main-background">
      {children}
    </div>

    </>
  )
}

export default SettingLayout

