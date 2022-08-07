import React from "react";
import { Grid, Row, Col } from "rsuite";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <Grid fluid className="h-100">
      <Row className="h-100">
        <Col className="h-100" xs={24} md={8}>
          <Sidebar  />
        </Col>
      </Row>
    </Grid>
  );
};

export default Home;
