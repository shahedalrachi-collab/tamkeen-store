import React from 'react'
import { Row, Col, Container } from "react-bootstrap";

import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import NavlinkItem from '../props/NavlinkItem';
import logo from '../assets/imgs/logo.png'
import { Link, NavLink } from 'react-router';
import { IconContext } from 'react-icons';
import IconLink from '../props/IconLink';

const footerLinks = {
  about: [
    { label: "About Us", to: "/about" },
    { label: "Find store", to: "/find-store" },
    { label: "Categories", to: "/categories" },
    { label: "Blogs", to: "/blogs" },
  ],
  partnership: [
    { label: "About Us", to: "/partnership/about" },
    { label: "Find store", to: "/partnership/find-store" },
    { label: "Categories", to: "/partnership/categories" },
    { label: "Blogs", to: "/partnership/blogs" },
  ],
  information: [
    { label: "Help Center", to: "/help-center" },
    { label: "Money Refund", to: "/money-refund" },
    { label: "Shipping", to: "/shipping" },
    { label: "Contact us", to: "/contact-us" },
  ],
  forUsers: [
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" },
    { label: "Settings", to: "/settings" },
    { label: "My Orders", to: "/my-orders" },
  ],
};

const socialLinks = [
  { label: "Facebook", icon: <FaFacebookF />, to: "https://facebook.com" },
  { label: "Twitter", icon: <FaTwitter />, to: "https://twitter.com" },
  { label: "LinkedIn", icon: <FaLinkedinIn />, to: "https://linkedin.com" },
  { label: "Instagram", icon: <FaInstagram />, to: "https://instagram.com" },
  { label: "YouTube", icon: <FaYoutube />, to: "https://youtube.com" },
];

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },

];
const Footer = () => {
  return (

    <footer className="footer ">

      <Container className='py-4'>
        <Row className="gy-4">
                    <Col xs={12} md={4} lg={3}>
            <Link to="/">
              <img src={logo} alt="" />

            </Link>
            <p>Best information about the company lies here, but now Lorem ipsum is...</p>
          </Col>

                    <Col xs={6} md={4} lg={2}>
            <h6>About</h6>
            {footerLinks.about.map((link) => (
              <Row key={link.label}>
                <Col>
                  <NavlinkItem {...link} className=" mb-2" />
                </Col>
              </Row>
            ))}
          </Col>

                    <Col xs={6} md={4} lg={2}>
            <h6>Partnership</h6>
            {footerLinks.partnership.map((link) => (
              <Row key={link.label}>
                <Col>
                  <NavlinkItem {...link} className=" mb-2" />
                </Col>
              </Row>
            ))}
          </Col>

                    <Col xs={6} md={4} lg={2}>
            <h6>Information</h6>
            {footerLinks.information.map((link) => (
              <Row key={link.label}>
                <Col>
                  <NavlinkItem {...link} className=" mb-2" />
                </Col>
              </Row>
            ))}
          </Col>

                    <Col xs={6} md={4} lg={2}>
            <h6>For users</h6>
            {footerLinks.forUsers.map((link) => (
              <Row key={link.label}>
                <Col>
                  <NavlinkItem {...link} className=" mb-2" />
                </Col>
              </Row>
            ))}
          </Col>

                    <Col xs={12} md={4} lg={1}>
            <h6>Get app</h6>
                      </Col>
        </Row>

                <Row className="mt-4">
          <Col xs={12} className="d-flex gap-3">
            {socialLinks.map((link) => (
              <IconLink key={link.label} {...link} className="social-icon" />
            ))}
          </Col>
        </Row>

      </Container>

      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center py-3">
            <Col xs={12} md={6}>
              <p className="mb-0">© {new Date().getFullYear()} Ecommerce.</p>
            </Col>

            {/* <Col xs={12} md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
              <div className="language-selector d-flex align-items-center gap-2">
                <select className="language-selector">

                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </Col> */}
          </Row>

        </Container>

      </div>

    </footer>
  );
};

export default Footer;