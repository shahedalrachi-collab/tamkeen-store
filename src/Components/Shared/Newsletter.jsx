import { useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <div className="newsletter text-center py-5">
        <Container>
              <h4>Subscribe on our newsletter</h4>
      <p>Get daily news on upcoming offers from many suppliers all over the world</p>

      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={5} lg={4} className="d-flex gap-2">
            <div className="email-input d-flex align-items-center">
              <FaEnvelope className="email-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="subscribe-btn">
              Subscribe
            </Button>
          </Col>
        </Row>
      </Form>

        </Container>

    </div>
  );
};

export default Newsletter;