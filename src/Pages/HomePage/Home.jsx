import { Link } from 'react-router';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { Container, Form } from 'react-bootstrap';
import { FaUserCircle } from "react-icons/fa";
import { MdSearch, MdOutlineInventory2, MdSend, MdShield } from "react-icons/md";

import Banner from '../../assets/imgs/banner.png';
import moreImage from '../../assets/imgs/more-category.png';
import home from '../../assets/imgs/home.jpg';
import sendquest from '../../assets/imgs/send-quest.png';
import electronics from '../../assets/imgs/electronics.png';
import serviceSource from '../../assets/imgs/service1.png';
import serviceCustomize from '../../assets/imgs/service2.png';
import serviceShipping from '../../assets/imgs/service3.png';
import serviceInspection from '../../assets/imgs/service4.png';

import PageLayout from '../../layout/PageLayout';
import My_Button from '../../props/My_Button';
import NavlinkItem from '../../props/NavlinkItem';
import MyCountdown from '../../MyCountdown';
import DealsCard from '../../props/DealsCard';
import Cards from '../../props/Cards';
import RecomendedCards from '../../props/RecomendedCards';
import ServiceCard from '../../props/ServiceCard';

import { ProductService } from '../../Services/ProductService';
import Newsletter from '../../Components/Shared/Newsletter';
import UserBox from '../../props/UserBox';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import SuccessModal from '../../Components/Shared/SuccessModal';



const discounts = ["-30%", "-15%", "-20%", "-10%", "-25%"];

const services = [
  { img: serviceSource, icon: <MdSearch />, title: "Source from Industry Hubs" },
  { img: serviceCustomize, icon: <MdOutlineInventory2 />, title: "Customize Your Products" },
  { img: serviceShipping, icon: <MdSend />, title: "Fast, reliable shipping by ocean or air" },
  { img: serviceInspection, icon: <MdShield />, title: "Product monitoring and inspection" },
];

const regions = [
  { code: "ae", name: "Arabic Emirates", site: "shopname.ae" },
  { code: "au", name: "Australia", site: "shopname.com.au" },
  { code: "us", name: "United States", site: "shopname.com" },
  { code: "ru", name: "Russia", site: "shopname.ru" },
  { code: "it", name: "Italy", site: "shopname.it" },
  { code: "dk", name: "Denmark", site: "denmark.com.dk" },
  { code: "fr", name: "France", site: "shopname.com.fr" },
  { code: "sa", name: "Saudi Arabia", site: "shopname.sa" },
  { code: "cn", name: "China", site: "shopname.cn" },
  { code: "gb", name: "Great Britain", site: "shopname.co.uk" },
];


const CategoryBanner = ({ img, title, link, dark }) => (
  <div style={{ position: 'relative' }}>
    <img className='banner-img' src={img} alt={title} />

    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '6%',
        transform: 'translateY(-50%)',
        maxWidth: '45%',
        color: dark ? '#1c1c1c' : '#fff',
        textShadow: dark ? 'none' : '0 1px 4px rgba(0,0,0,0.35)',
      }}
    >
      <div>Latest trending</div>
      <h3 className='fw-bold mb-3'>{title}</h3>
      <Link to={link} className='btn btn-light fw-semibold'>Shop now</Link>
    </div>
  </div>
)


const Home = () => {
  const { user } = useContext(AuthContext)


  const [showWelcome, setShowWelcome] = useState(sessionStorage.getItem("justLoggedIn") === "yes")

  const closeWelcome = () => {
    sessionStorage.removeItem("justLoggedIn")
    setShowWelcome(false)
  }

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    ProductService.GetAllCategories()
      .then((list) => {
        setCategories(list.slice(0, 8))
      })
      .catch((err) => {
        console.log(err.message)
      })
  }, [])

  const firstKey = categories.length > 0 ? String(categories[0].id) : 'more'
  const activeKey = activeTab || firstKey

  useEffect(() => {
    ProductService.GetProducts()
      .then((products) => {
        setProducts(products)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const deals = products.slice(0, 10)
  const homeProducts = products.slice(5, 13)
  const electroProducts = products.slice(7, 15)
  const recommended = products.slice(0, 10)


  return (
    <PageLayout>
      <Container className='pt-4'>

        <SuccessModal
          show={showWelcome}
          onClose={closeWelcome}
          title={user?.name ? `Hello ${user.name}` : 'Hello'}
          message="you have successfully logged in"
        />

        <div className='border p-3 rounded-3 background-white'>
          <Tab.Container id="left-tabs-example" activeKey={activeKey} onSelect={(key) => setActiveTab(key)}>
            <Row>

              <Col lg={3}>
                <Nav variant="pills" className="flex-column">
                  {categories.map((category) => (
                    <Nav.Item key={category.id}>
                      <Nav.Link eventKey={String(category.id)}>{category.name}</Nav.Link>
                    </Nav.Item>
                  ))}

                  <Nav.Item>
                    <Nav.Link eventKey="more">More category</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>


              <Col lg={7}>
                <Tab.Content>
                  {categories.map((category) => (
                    <Tab.Pane eventKey={String(category.id)} key={category.id}>
                      <CategoryBanner
                        img={category.image || Banner}
                        title={category.name}
                        link={`/products?category=${category.id}`}
                        dark={!category.image}
                      />
                    </Tab.Pane>
                  ))}

                  <Tab.Pane eventKey="more">
                    <CategoryBanner img={moreImage} title="More categories" link="/products" />
                  </Tab.Pane>
                </Tab.Content>
              </Col>

              <Col lg={2}>
                <UserBox />

                <div className='Bannerlinks'>
                  <NavlinkItem className='bannerlink p-4 rounded-2 mt-2' label="Get US $10 off with a new supplier" />
                  <NavlinkItem className='bannerlink2 p-4 rounded-2 mt-2' label="Get US $10 off with a new supplier" />
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </div>


        {loading && <p className="text-center my-4">Loading products...</p>}
        {error && <p className="text-center text-danger my-4">{error}</p>}


        <div className='my-4 border px-3 rounded-3 background-white'>
          <Container>
            <Row className="align-items-center">
              <Col className='count-col' xs={12} lg={2}>
                <MyCountdown />
              </Col>

              <Col xs={12} lg={10}>
                <Swiper
                  spaceBetween={0}
                  slidesPerView={2}
                  grabCursor
                  breakpoints={{
                    992: { slidesPerView: 5 },
                  }}
                >
                  {deals.map((pdct, index) => (
                    <SwiperSlide className='offer-col' key={pdct.id}>
                      <Link to={`/products/${pdct.id}`} className="product-link">
                        <DealsCard
                          img={<img className='offer-img' src={pdct.image} alt={pdct.name} />}
                          title={pdct.name}
                          discount={discounts[index % discounts.length]}
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Col>
            </Row>
          </Container>
        </div>


        <Container>
          <Row className='cards-wrapper my-3 background-white'>
            <Col className='home-col' xs={12} lg={3}>
              <div className='home-img-wrapper'>
                <img className='home-img' src={home} alt="home background" />
                <div className='home-overlay'></div>
                <div className='home-content'>
                  <h5 className='home-title'>Home and<br />outdoor</h5>
                  <My_Button label="Source now" className="home-btn" />
                </div>
              </div>
            </Col>

            <Col xs={12} lg={9}>
              <Row>
                {homeProducts.map((pdct) => (
                  <Col className='home-col' xs={6} lg={3} key={pdct.id}>
                    <Link to={`/products/${pdct.id}`} className="product-link">
                      <Cards
                        img={<img className='home-card-img' src={pdct.image} alt={pdct.name} />}
                        title={pdct.name}
                        price={pdct.price}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>


        <Container>
          <Row className='cards-wrapper my-3 background-white'>
            <Col className='home-col' xs={12} lg={3}>
              <div className='electro-img-wrapper'>
                <img className='electronics-img' src={electronics} alt="electronics background" />
                <div className='electronics-overlay'></div>
                <div className='home-content'>
                  <h5 className='home-title'>Consumer <br />electronics and <br />gadgets</h5>
                  <My_Button label="Source now" className="home-btn" />
                </div>
              </div>
            </Col>

            <Col xs={12} lg={9}>
              <Row>
                {electroProducts.map((pdct) => (
                  <Col className='home-col' xs={6} lg={3} key={pdct.id}>
                    <Link to={`/products/${pdct.id}`} className="product-link">
                      <Cards
                        img={<img className='home-card-img' src={pdct.image} alt={pdct.name} />}
                        title={pdct.name}
                        price={pdct.price}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>


        <Container className='supplier-form my-4'>
          <img className='supplier-bg' src={sendquest} alt="" />
          <div className='supplier-overlay'></div>
          <Container className='position-relative'>
            <Row>
              <Col lg={6}>
                <h1 className="text-white fw-bold">An easy way to send requests to all suppliers</h1>
                <p className="text-white-50">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
                </p>
              </Col>

              <Col lg={6}>
                <div className='supplier-form-card background-white rounded-3 p-4'>
                  <h5>Send quote to suppliers</h5>
                  <Form.Control className="mb-3" placeholder="What item you need?" />
                  <Form.Control as="textarea" className="mb-3" placeholder="Type more details" />
                  <div className='d-flex gap-2'>
                    <Form.Control className='quantity' placeholder="Quantity" />
                    <Form.Select className='select'>
                      <option>Pcs</option>
                    </Form.Select>
                  </div>
                  <My_Button label="Send inquiry" className='Send-inquiry-btn' />
                </div>
              </Col>
            </Row>
          </Container>
        </Container>


        <Container>
          <div className="recommended-section py-5">
            <h5 className="mb-4">Recommended items</h5>
            <div className="recommended-grid">
              {recommended.map((pdct) => (
                <div className="recommended-item" key={pdct.id}>
                  <Link to={`/products/${pdct.id}`} className="product-link">
                    <RecomendedCards
                      id={pdct.id}
                      img={<img className='reco-card-img' src={pdct.image} alt={pdct.name} />}
                      title={pdct.name}
                      price={pdct.price}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Container>


        <Container className="pb-5">
          <h5 className="mb-4">Our extra services</h5>
          <Row className="g-3">
            {services.map((service) => (
              <Col xs={12} sm={6} lg={3} key={service.title}>
                <ServiceCard {...service} />
              </Col>
            ))}
          </Row>
        </Container>


        <Container className="pb-5">
          <h5 className="mb-4">Suppliers by region</h5>
          <Row xs={2} sm={3} lg={5} className="g-2 region-row">
            {regions.map((region) => (
              <Col key={region.code}>
                <div className="region-item d-flex align-items-center gap-2 p-2 rounded">
                  <span className={`fi fi-${region.code} fs-4`}></span>
                  <div>
                    <p className="region-name mb-0">{region.name}</p>
                    <p className="mb-0 small text-body-secondary" dir="ltr">{region.site}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        <Newsletter />

      </Container>
    </PageLayout>
  )
}

export default Home