import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import authBg from '../assets/imgs/auth-logo.png'
import authlogo from '../assets/imgs/authlogo.png'
import TopBanner from '../Components/TopBanner'

const AuthLayout = ({children}) => {
  return (
    <>

        <Container fluid className="p-0">
           <TopBanner/>

      <Row className="g-0 vh-100">

        <Col lg={6} className="d-none d-lg-block p-0">
          <div className="auth-image-wrap">
            <img src={authBg} alt="borcelle online store" className="auth-image" />

            <div className="auth-overlay">
              <img src={authlogo} alt="Borcelle" className="auth-logo" />
              <h2 className="auth-title">Let's get started</h2>
              <p className="auth-description">
                Where opportunities meet simplicity! Whether you're here to fill out your cart
                or to check irresistible offers.
              </p>
            </div>
          </div>
        </Col>

        <Col lg={6} className="d-flex align-items-center justify-content-center">
          <div className="auth-form-wrap">{children}</div>
        </Col>
      </Row>
    </Container>
        </>

  )
}
export default AuthLayout