import React, {Fragment} from "react";
import classes from "./CurrentOrder.module.css";

const CurrentOrder = (props) => {
  let totalPrice = 0;
  Object.keys(props.inputValues).forEach(el=>{
     totalPrice = totalPrice + props.inputValues[`${el}`].quantity * props.inputValues[`${el}`].price
  })
  return (
    <Fragment>
    <div className={classes.CurrentOrder}>
      {props.children}
    </div>
    {totalPrice>0 &&<p className={classes.TotalPrice}>Total price of all items is: {totalPrice} levs</p>}
      </Fragment>
  );
};

export default CurrentOrder;
