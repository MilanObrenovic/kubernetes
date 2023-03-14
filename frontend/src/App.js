import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";
import {Button, List} from "antd";

const url = "/api/v1/customers";

function App() {
  console.log(process.env.NODE_ENV);

  const [
    customers,
    setCustomers,
  ] = useState([]);

  const [
    orders,
    setOrders,
  ] = useState([]);

  useEffect(() => {
    console.log(url);
    axios.get(url)
      .then((res) => {
        console.log("Success.");
        console.log(res.data);
        setCustomers(res.data);
      })
      .catch((e) => {
        console.log("Error, something went wrong...");
        console.log(e);
      });
  }, []);

  console.log(customers);

  function fetchOrder(id) {
    console.log("Fetching orders for customer " + id);
    axios.get(url + "/" + id + "/orders")
      .then((res) => {
        setOrders(res.data.items);
      })
      .catch(console.log);
  }

  function renderCustomers() {
    return (
      <div>
        <List
          size={"large"}
          header={<h1>Customers</h1>}
          footer={"Data coming from customer microservice"}
          bordered
          dataSource={customers}
          renderItem={(item) => {
            return (
              <List.Item>
                {`Name: ${item.name} | Gender: ${item.gender} | Address: ${item.address} – `}
                <Button size={"small"} onClick={() => fetchOrder(item.id)}>
                  View Orders
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  function renderOrders() {
    return (
      <List
        size={"large"}
        header={<h1>Orders</h1>}
        footer={"Data coming from order microservice via customer"}
        bordered
        dataSource={orders}
        renderItem={(item) => {
          return (
            <List.Item>
              {`Item ${item}`}
            </List.Item>
          );
        }}
      />
    );
  }

  return (
    <div>
      {customers.length < 1 ? "No data." : renderCustomers()}
      {orders && orders.length < 1 ? "No customer selected." : renderOrders()}
    </div>
  );
}

export default App;
