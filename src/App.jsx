import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Textbox from "./components/textbox/textbox";
import Dropdown from "./components/dropdown/dropdown";
import CustomButton from "./components/button/button";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });
  const [txtName, setTxtName] = useState("");
  const [textPrice, setTextPrice] = useState("");
  const [textQuantity, setTextQuantity] = useState("");
  const [shipping, setShippingFee] = useState(0);
  const towns = ["Tubigon", "Calape", "Tagbilaran", "Luay"];
  const fee = {
    Tubigon: 30,
    Calape: 50,
    Tagbilaran: 80,
    Luay: 120,
  };
  const [editIndex, setEditIndex] = useState(null);

  let subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function onChange(e) {
    const id = e.target.id;
    const value = e.target.value;

    if (id === "txtName") setTxtName(value);
    if (id === "txtPrice") setTextPrice(value);
    if (id === "txtQuantity") setTextQuantity(value);
    if (towns.includes(value)) {
      setShippingFee(fee[value]);
    }
  }

  function addToChart() {
    if (txtName && textPrice && textQuantity) {
      const item = {
        name: txtName,
        price: parseFloat(textPrice),
        quantity: parseInt(textQuantity),
      };

      if (editIndex !== null) {
        const updatedItems = [...cartItems];
        updatedItems[editIndex] = item;
        setCartItems(updatedItems);
        setEditIndex(null);
      } else {
        setCartItems(prevItems => [...prevItems, item]);
      }

      setTxtName("");
      setTextPrice("");
      setTextQuantity("");

      window.scrollTo({
        top: document.querySelector(".item-container").offsetTop,
        behavior: 'smooth'
      });
    }
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem("cartItems"); 
  }

  function deleteItem(itemIndex) {
    const cartNewItems = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(cartNewItems);
  }

  function editItem(itemIndex) {
    const itemToEdit = cartItems[itemIndex];
    setTxtName(itemToEdit.name);
    setTextPrice(itemToEdit.price);
    setTextQuantity(itemToEdit.quantity);
    setEditIndex(itemIndex);

    window.scrollTo({
      top: document.querySelector(".sub-container").offsetTop,
      behavior: 'smooth'
    });
  }

  function formatCurrency(num) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(num);
  }

  function handleCheckout() {
    window.location.href = "www.facebook.com"; 
  }

  return (
    <div>
      <div className="main-container">
        <div className="sub-container">
          <Textbox
            id="txtName"
            type="text"
            label="Item Name"
            value={txtName}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <Textbox
            id="txtPrice"
            type="number"
            label="Item Price"
            value={textPrice}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <Textbox
            id="txtQuantity"
            type="number"
            label="Quantity"
            value={textQuantity}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <div className="d-flex justify-content-center py-2">
            <CustomButton
              label={editIndex !== null ? "Update Item" : "Add to Cart"}
              onClick={addToChart}
              variant="primary"
            />
          </div>
        </div>
        {cartItems.length > 0 && (
          <div className="item-container my-5">
            <h3 className="text-center py-3">CART ITEMS</h3>
            <div className="d-flex justify-content-end">
              <CustomButton
                onClick={clearCart}
                label="Clear"
                variant="danger"
                innerClass="m-1"
              />
            </div>
            <Table striped bordered>
              <thead>
                <tr className="text-capitalize">
                  <th>Item #</th>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => {
                  const total = item.price * item.quantity;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(total)}</td>
                      <td className="text-center" width={200}>
                        <CustomButton
                          label="Edit"
                          variant="success"
                          innerClass="m-1"
                          onClick={() => editItem(index)}
                        />
                        <CustomButton
                          label="Delete"
                          variant="danger"
                          innerClass="m-1"
                          onClick={() => deleteItem(index)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center">
              <Dropdown
                id="drpTown"
                label="Town"
                options={towns}
                containerClass="w-100"
                onSelectChange={onChange}
              />
              <Dropdown
                name="drpPayment"
                label="Payment Method"
                options={["gcash", "creditcard", "Cash on delivery"]}
                containerClass="w-100"
                onSelectChange={onChange}
              />
            </div>
            <div>
              <h4>Subtotal: {formatCurrency(subTotal)}</h4>
              <h4>Shipping Fee: {formatCurrency(shipping)}</h4>
              <h4>Grand Total: {formatCurrency(subTotal + shipping)}</h4>
              <div className="d-flex justify-content-center py-3">
                <CustomButton
                  label="Checkout"
                  variant="success"
                  onClick={handleCheckout}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
