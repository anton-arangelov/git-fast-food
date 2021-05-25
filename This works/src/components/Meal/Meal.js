import React from "react";
import classes from "./Meal.module.css";

const Meal = (props) => {

  return (
    <div className={classes.Meal}>
      <section className={classes.ColumnOne}>
        <img src={props.img} alt="meal"></img>
      </section>
      <section className={classes.ColumnTwo}>
        <p>{props.name}</p>
        <p>{props.description}</p>
        <p>The price is {props.price} levs</p>
        <div className={classes.OrderDiv}>
          <label>Quantity</label>
          <input onChange={props.onValueChange} value={props.value} type="number"></input>
          <button onClick = {props.onOrder}>Order</button>
        </div>
      </section>
    </div>
  );
};
// input={{
//   id: "amount",
//   type: "number",
//   min: "1",
//   max: "5",
//   step: "1",
//   defaultValue: "1",
// }}

export default Meal;
