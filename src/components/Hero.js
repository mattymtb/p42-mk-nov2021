import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {
  const {
    isAuthenticated
  } = useAuth0();

  return (
    <div className="jumbotron mk-hero">
      <h1 className="mk-white">Pizza 42</h1>
      {!isAuthenticated && (
        <p className="lead mk-yellow">
          Please login to place an order
        </p>
      )}

    </div>

  );
}

export default Hero;
