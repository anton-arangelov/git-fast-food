import React, { useEffect, useState, Fragment, useRef } from "react";
import useAxios from "../../hooks/useAxios.js";
import axios from "axios";
import Spinner from "../../ui/Spinner.js";
import classes from "./SavedOrders.module.css";

const SavedOrders = (props) => {
  const interval = useRef(undefined);

  const [orders, setOrders] = useState([]);
  const user = props.user;

  const [shouldCheckStatus, setShouldCheckStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  let status = "";

  const transformData = (dataObj) => {
    let updatedOrders = [];
    Object.keys(dataObj.data).forEach((el) => {
      updatedOrders.push(dataObj.data[el]);
      setOrders(updatedOrders);
    });
  };
  const {
    loading,
    error,
    sendRequest: fetchData,
  } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders${
        user ? `/${user.replace(".", "_")}` : ""
      }/orders.json`,
      func: axios.get,
      body: null,
    },
    transformData,
    () => {}
  );

  const stop = () => {
    if (!interval.current) return;
    clearInterval(interval);
    interval.current = null;
  };

  const start = () => {
    if (!interval.current)
    interval.current = setInterval(() => {
      setShouldCheckStatus(false);
      setCurrentTime(new Date().getTime());
    }, 30000);
  };

  useEffect(() => {
    if (shouldCheckStatus) {
      start();
    } else stop();
  }, [shouldCheckStatus]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);

  return (
    <Fragment>
      {error &&
      error.toString() ===
        "TypeError: Cannot convert undefined or null to object" ? (
        <div>There are no orders</div>
      ) : (
        <div>
          {error ? (
            <div>{error.response.data}</div>
          ) : (
            <Fragment>
              {loading ? (
                <Spinner />
              ) : user && (
                <div>
                  <p style={{ textAlign: "center" }}>
                    Each order takes 2 minutes to be ready. If your order is
                    older than 2 minutes it will be with status "ready".
                    Otherwise it will be with status "pending"
                  </p>
                  {orders.map((data) => {
                    if (
                      currentTime - new Date(data.date).getTime() >
                      60000 * 2
                    ) {
                      status = "ready";
                    } else {
                      status = "pending";
                      console.log(shouldCheckStatus)
                      if (!shouldCheckStatus) {
                        setShouldCheckStatus(true);
                      }
                    }
                    return (
                      <div
                        className={classes.SavedOrder}
                        key={new Date(data.date).toLocaleString()}
                      >
                        <div className={classes.FirstColumn}>
                          {" "}
                          On {new Date(data.date).toLocaleString()} you ordered:
                          {Object.keys(data.order).map((el) => {
                            if (data.order[el].quantity > 0) {
                              return (
                                //CAN BE A SEPARATE SAVEDORDER COMPONENT
                                <div key={data.order[el].name}>
                                  {data.order[el].name} X
                                  {data.order[el].quantity}
                                  {` which cost ${
                                    data.order[el].quantity *
                                    data.order[el].price
                                  } levs`}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <div
                          className={`${classes.SecondColumn} ${
                            status === "pending" && classes.Pending
                          }`}
                        >
                          {status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default SavedOrders;
