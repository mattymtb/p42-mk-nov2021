import React, { useState } from "react";
import { Button, Alert, Card, Row, Col, CardImg, CardBody } from "reactstrap";
// import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import menuItems from "../utils/menuItems";
import { Toast, ToastBody, ToastHeader } from 'reactstrap';



export const ExternalApiComponent = () => {

  const { orderApi } = getConfig();

  //mk
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);
  //mk

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const toastStyle = {
    position: 'fixed',
    top: 10,
    left: 10
  };

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
    user
  } = useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const callApi = async (itemName) => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${orderApi}/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: itemName
        })
      });

      const responseData = await response.json();

      console.log("here is user info: " + JSON.stringify(user));
      toggle();

      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {

      console.log('error:', error);
      setState({
        ...state,
        showResult: true,
        error: error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  const populatePriorOrders = () => {

    if (user['https://pizza-42-mk/prior_orders'] && user['https://pizza-42-mk/prior_orders'].length > 0) {

      let priorOrders = [];

      user['https://pizza-42-mk/prior_orders'].forEach(element => {

        let item = menuItems.find(item => item.itemName === element);
        if (priorOrders.indexOf(item) > -1) {
          return;
        }
        priorOrders.push(item);

      });

      return priorOrders.map(item => (
        <Col sm="4" key={item.itemId} className="mb-3">
          <Card>
            <CardImg top height="300px" src={item.itemURL} alt="Card image cap" />
            <CardBody>
              <h4>{item.itemName}</h4>
              <p>{item.itemDesc}</p>
              <p>${item.itemPrice}</p>
              <Button
                color="primary"
                className="mt-5"
                onClick={() => callApi(item.itemName)}
                disabled={!user.email_verified}
              >
                Order {item.itemName} pizza again
              </Button>
            </CardBody>
          </Card>
        </Col>
      ));



    }
  }

  const populateAllPizzas = () => {
    return menuItems.map(item => (
      <Col sm="4" key={item.itemId} className="mb-3">
        <Card>
          <CardImg top height="300px" src={item.itemURL} alt="Card image cap" />
          <CardBody>
            <h4>{item.itemName}</h4>
            <p>{item.itemDesc}</p>
            <p>${item.itemPrice}</p>
            <Button
              color="primary"
              className="mt-5"
              onClick={() => callApi(item.itemName)}
              disabled={!user.email_verified}
            >
              Order {item.itemName} pizza
            </Button>
          </CardBody>
        </Card>
      </Col>
    ));
  }


  return (
    <>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}

        {!user.email_verified && (
          <Alert color="info">
            <p>
              Your email hasn't been verified yet.
            </p>
            <p>
              In order to place an order, check your email and click on the verification link, then login again.
            </p>
          </Alert>
        )}

        <div style={toastStyle}>
          <Toast isOpen={show}>
            <ToastHeader toggle={toggle}>Order registered!</ToastHeader>
            <ToastBody>
              Your pizza has been saved in order history. Next time you log in you'll have the option to re-order pizzas you've selected in the past.
            </ToastBody>
          </Toast>
        </div>

        {user['https://pizza-42-mk/prior_orders'] && user['https://pizza-42-mk/prior_orders'].length > 0 &&

          <Row>
            <Col sm="12">
              <h2 className="my-5 text-center">Pizzas you've ordered in the past</h2>
            </Col>

            {populatePriorOrders()}
          </Row>
        }

        <Row>
          <Col sm="12">
            <h2 className="my-5 text-center">All Pizzas</h2>
          </Col>
          {populateAllPizzas()}
        </Row>
      </div>

      {/* <div className="result-block-container">
        {state.showResult && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Debug Info</h6>
            <Highlight>
              <span></span>
            </Highlight>
          </div>
        )}
      </div> */}
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
