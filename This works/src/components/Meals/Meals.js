import React, { useState } from "react";
import classes from "./Meals.module.css";
import Meal from "../Meal/Meal.js";
import DUMMY_MEALS from './DummyData.js'

let inputValues = { chickenKebap: "", pizza: "", roastedChicken: "", rice: "" };

const Meals = (props) => {
  
  const [, setValue] = useState();

  const onOrder = (el) => {
    setValue("")
    props.setElement(el);
    props.setNumber(inputValues[el]);
    Object.keys(inputValues).map(e=>{
      return inputValues[e] = ''
    });
  };

  const onValueChange = (event, element) => {
    if (event.target.value < 0){
      return
    }
    props.setNumber(0);
    setValue(event.target.value);
    inputValues[`${element}`] = +event.target.value

  };
  return (
    <div className={classes.Meals}>
      {DUMMY_MEALS.map((data) => {
        return Object.keys(data).map((el) => {
          return (
            <Meal
              key={data[el].name}
              name={data[el].name}
              description={data[el].description}
              img={data[el].img}
              price={data[el].price}
              setItemsNumber={props.setItemsNumber}
              onOrder={() => onOrder(el)}
              value={inputValues[el] ? inputValues[el] : ``}
              onValueChange={(e) => onValueChange(e, el)}
            />
          );
        });
      })}
    </div>
  );
};

export default Meals;
