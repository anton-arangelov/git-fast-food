import React, { Fragment } from "react";
import classes from "./Modal.module.css";

// import ReactDOM from 'react-dom';

const Backdrop = (props) => {
  return (
    <div className={classes.Backdrop} onClick={props.onClose}>
      <h1>X</h1>
    </div>
  );
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.Modal}>
      <div className={classes.Content}>{props.children}</div>
    </div>
  );
};

// const portalElement = document.getElementById('overlays');
const Modal = (props) => {
  let totalPrice = 0;
  Object.keys(props.inputValues).forEach(el=>{
     totalPrice = totalPrice + props.inputValues[`${el}`].quantity * props.inputValues[`${el}`].price
  })
  const loggedIn = props.loggedIn;
  return (
    <Fragment>
      <Backdrop onClose={props.onClose} />
      <ModalOverlay>
        {loggedIn ? (
          <Fragment>
            <h1>Your order is:</h1>
            <div>
              Order itself{" "}
              {Object.keys(props.inputValues).map((data) => {
                return Object.keys(props.inputValues[data]).map((el) => {
                  if (el !== "quantity") {
                    return null;
                  }
                  if (props.inputValues[data].quantity === 0) {
                    return null;
                  }
                  return (
                    <div key={props.inputValues[data].name}>
                      {props.inputValues[data].name}:{" "}
                      {props.inputValues[data].quantity}
                      <p>Total price:{props.inputValues[data].quantity * props.inputValues[data].price}</p>
                    </div>
                  );
                });
              })}
              {props.children}
            </div>
            <p>Total price ot all oreders is: {totalPrice}</p>
            <button onClick={props.onClose}>Cancel</button>
            <button onClick={props.onConfirm}>Confirm</button>
          </Fragment>
        ) : (
          <Fragment>
            <h1>You need to log in to make an order</h1>
            <button onClick={props.onLoginSignUpClicked}>
              Log in / Sign up
            </button>
          </Fragment>
        )}
      </ModalOverlay>
    </Fragment>
  );
};

export default Modal;
