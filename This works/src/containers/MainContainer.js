import React, { Fragment, useEffect, useState } from "react";
import Meals from "../components/Meals/Meals.js";
import Header from "../components/Header/Header.js";
import CurrentOrder from "../components/CurrentOrder/CurrentOrder.js";
import OrderItem from "../components/OrderItem/OrderItem.js";
import Modal from "../components/Modal/Modal.js";
import { Route, Switch, useHistory } from "react-router-dom";
import SavedOrders from "../components/SavedOrders/SavedOrders.js";
import axios from "axios";
import useAxios from "../hooks/useAxios.js";
import Spinner from "../ui/Spinner.js";
import LoginSignUp from "../components/LoginSignUp/LoginSignUp.js";
import OrderButton from "../components/OrderButton/OrderButton.js";
import ContactForm from "../components/ContactForm/ContactForm.js";

const MainContainer = () => {
  const history = useHistory();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [user, setUser] = useState(localStorage.getItem("user"));

  const [inputValues, setInputValues] = useState({
    chickenKebap: { name: "Chicken Kebap", quantity: 0, price: 5},
    pizza: { name: "Pizza", quantity: 0, price: 3},
    roastedChicken: { name: "Roasted Chicken", quantity: 0, price: 4},
    rice: { name: "Rice", quantity: 0, price: 2},
    // date: "",
  });

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const [number, setNumber] = useState(0);
  const [element, setElement] = useState();

  const [fetchedTelephoneValue, setFetchedTelephoneValue] = useState('');
  const [fetchedAddressValue, setFetchedAddressValue] = useState('');
  const [telephoneValue, setTelephoneValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
 

//FOR THE POST REQUEST
  const {
    loading,
    error,
    sendRequest: postData,
  } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
        user && user.replace(".", "_")
      }/orders.json`,
      func: axios.post,
      // body: [inputValues, new Date().toLocaleString],
      body: { order: inputValues, date: new Date().toLocaleString() },
    },
    () => {},
    ()=>{}
  );

  const {
    error: errorPostContact,
    sendRequest: postContact,
  } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
        user && user.replace(".", "_")
      }/contact.json`,
      func: axios.post,
      // body: [inputValues, new Date().toLocaleString],
      body: { telephone: telephoneValue, address: addressValue },
    },
    () => {},
    ()=>{}
  );

  //TO GET ADDRESS AND TELEPHONE WHEN USER SIGNS IN
const transformData=(dataObj)=>{
  if (!dataObj){
    setTelephoneValue('')
      setAddressValue('')
  }
    Object.keys(dataObj.data).forEach(el=>{
      setTelephoneValue(dataObj.data[el].telephone)
      setAddressValue(dataObj.data[el].address)
      setFetchedTelephoneValue(dataObj.data[el].telephone)
      setFetchedAddressValue(dataObj.data[el].telephone)
    })
  
}

  const {
    sendRequest: getContact,
  } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
        user && user.replace(".", "_")
      }/contact.json`,
      func: axios.get,
      body: null
    },
    transformData,
    ()=>{}
  );
  // const orders = JSON.parse(localStorage.getItem("me"));

  //   const retrieveStoredToken =()=>{
  //     return localStorage.getItem('token')
  // }

  const totalAmountOfItems =
    Object.keys(inputValues).reduce((currentNumber, element) => {
      if (element !== "date") {
        return currentNumber + inputValues[element].quantity;
      }
      return currentNumber;
    }, 0) + number;

Object.keys(inputValues).forEach((el) => {
  if (el === element) {
    inputValues[el].quantity = inputValues[el].quantity + +number;
  }
});

  const onCancelItem = (data) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[data].quantity = 0;
    setInputValues(updatedInputValues);
    setNumber(0);
    setElement("");
  };

  const onAddItem = (data) => {
    const updatedInputValues = { ...inputValues };
    // Object.keys(updatedInputValues).map(el=>{
    //   updatedInputValues[el] = {...inputValues[el]}
    // })
    // console.log(updatedInputValues)
    updatedInputValues[data].quantity = updatedInputValues[data].quantity + 1;
    setInputValues(updatedInputValues);
    setNumber(0);
    setElement("");
  };

  const onRemoveItem = (data) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[data].quantity = updatedInputValues[data].quantity - 1;
    setInputValues(updatedInputValues);
    setNumber(0);
    setElement("");
  };

  const onOrder = () => {
    if (totalAmountOfItems === 0) {
      return;
    }
    setModalIsVisible(true);
    setNumber(0);
    setElement("");
  };

  const onClose = () => {
    setModalIsVisible(false);
    setNumber(0);
    setElement("");
  };

  const onConfirm = () => {
    postData();
    if(telephoneValue !== fetchedTelephoneValue || addressValue !== fetchedAddressValue){
    (async()=>{
      await axios.delete(`https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
        user && user.replace(".", "_")
      }/contact.json`)
      postContact()
    })()
    }
    setModalIsVisible(false);
    setNumber(0);
    setElement("");
    Object.keys(inputValues).forEach((el) => {
      inputValues[el].quantity = 0;
    });
  };

  const onLoginSignUpClicked = () => {
    history.push("/auth");
    onClose();
  };

  const onLogoutHandler = () => {
    setNumber(0)
    setLoggedIn(false);
    setUser("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/");
  };

  const onChangeTelephoneValueHandler = (e) => {
    setTelephoneValue(e.target.value);
  };

  const onChangeAddressValueHandler = (e) => {
    setAddressValue(e.target.value);
  };

  const errorItself = <div>
    {error ? error.toString() : errorPostContact? errorPostContact.toString() :null}
  </div>

  useEffect(()=>{
    if (loggedIn && modalIsVisible && telephoneValue ==='' && addressValue === ''){
      getContact()
    }
  },[loggedIn, modalIsVisible, telephoneValue, addressValue, getContact])
  return (
    <Fragment>
      {(error || errorPostContact )? (
        <div>{errorItself}</div>
      ) : (
        <Fragment>
          {loading ? (
            <Spinner />
          ) : (
            <Fragment>
              <Header
                itemsNumber={totalAmountOfItems}
                user={user}
                onLogoutHandler={onLogoutHandler}
                loggedIn={loggedIn}
              />
              <Switch>
                <Route path="/orders">
                  <SavedOrders user={user} />
                </Route>
                <Route path="/auth">
                  <LoginSignUp
                    setLoggedIn={setLoggedIn}
                    setUser={setUser}
                    setToken={setToken}
                  />
                </Route>
                <Route path="">
                  <Fragment>
                    <Fragment>
                      {modalIsVisible && (
                        <Modal
                          onClose={onClose}
                          onConfirm={onConfirm}
                          inputValues={inputValues}
                          onLoginSignUpClicked={onLoginSignUpClicked}
                          loggedIn={loggedIn}
                        ><ContactForm
                        telephoneValue={telephoneValue}
                        onChangeTelephoneValueHandler={onChangeTelephoneValueHandler}
                        addressValue={addressValue}
                        onChangeAddressValueHandler={onChangeAddressValueHandler}
                      /></Modal>
                      )}
                      <CurrentOrder inputValues={inputValues}>
                        {totalAmountOfItems !== 0 &&
                          Object.keys(inputValues).map((el) => {
                            if (
                              inputValues[el].quantity === 0 ||
                              el === "date"
                            ) {
                              return null;
                            }
                            return (
                              <OrderItem
                                key={inputValues[el].name}
                                name={inputValues[el].name}
                                quantity={inputValues[el].quantity}
                                price={inputValues[el].price}
                                onCancelItem={() => onCancelItem(el)}
                                onAddItem={() => onAddItem(el)}
                                onRemoveItem={() => onRemoveItem(el)}
                              ></OrderItem>
                            );
                          })}
                      </CurrentOrder >
                      <OrderButton onOrder={onOrder} loggedIn={loggedIn} />
                    </Fragment>
                    <Meals setNumber={setNumber} setElement={setElement} />
                  </Fragment>
                </Route>
              </Switch>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default MainContainer;
