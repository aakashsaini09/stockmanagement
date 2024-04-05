"use client"
import { useState, useEffect } from "react";
import './Styles/Header.css'
export default function Home() {
  const [productForm, setproductForm] = useState({})
  const [products, setproducts] = useState([])
  const [alert, setalert] = useState("")
  const [query, setquery] = useState("")
  const [loading, setloading] = useState(false)
  const [dropdown, setdropdown] = useState([])
  const [loadingaction, setloadingaction] = useState(false)
  const [alertMsg, setalertMsg] = useState(false)
  // const [stockValue, setstockValue] = useState(parseInt(0))
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let resJson = await response.json();
      setproducts(resJson.products)
      // products.map((item) => {
      //   setstockValue(stockValue+parseInt(item.price));
      //   console.log(stockValue)
      //   return stockValue
      // })
    }
    fetchProducts()
  }, [])
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });
      if (response.ok) {
        console.log("Product added successfully");
        setalert("Your product has been added!")
        setproductForm({})
      }
      else {
        console.log("Error in Product data");
      }
    } catch (error) {
      console.log('Error:', error)
    }
    // (three lines):Fetch all the products again to sync back new product.
    const response = await fetch('/api/product')
    let resJson = await response.json();
    setproducts(resJson.products)
  };
  const handleChange = (e) => {
    setproductForm({ ...productForm, [e.target.name]: e.target.value })
  }
  const editDropdown = async (e) => {
    let value = e.target.value
    setquery(value);
    if (value.length > 2) {
      setloading(true)
      setdropdown([])
      const response = await fetch('./api/search?query=' + query)
      let rjson = await response.json();
      setdropdown(rjson.products)
      setloading(false)
    }
    else {
      setdropdown([])
    }
  }
  let temp = 0;
  // const totalValue = async () =>{
  //   let productsPrice = await products
  //   productsPrice.map((item) => {
  //     parseInt(temp)
  //     temp = temp + parseInt(item.price);
  //     return temp
  //   })
  //   console.log("temp = ", temp)
  // }
  // totalValue()
  const incDecVal = async (action, slug, initialQuantity) => {
    // constently changing the quantity of the product with given slug in products.
    let index = products.findIndex((item) => item.slug == slug)
    let newProduct = JSON.parse(JSON.stringify(products))
    if (action == "add") {
      newProduct[index].quantity = parseInt(initialQuantity) + 1
    } else {
      newProduct[index].quantity = parseInt(initialQuantity) - 1
    }
    setproducts(newProduct)


    // constently changing the quantity of the product with given slug in dropdown.
    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "add") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setdropdown(newDropdown)
    console.log(action, slug)
    setloadingaction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    setloadingaction(false)
  }
  // const deleteProduct = async (id) => {
    // const response = await fetch('/api/delete', {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(id)
    // });
    // console.log(deletionResult)
    // setproducts(deletionResult)
  // }
  const handleButtonClick = () => {
    setalertMsg(true);
  };

  const handleCloseAlert = () => {
    setalertMsg(false);
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="text-center py-6">
          <div className="text-green-800">{alert}</div>
          <h1 className="text-3xl font-bold mb-6">Search a Product</h1>
          <div className="flex justify-center mb-2">
            <input onChange={editDropdown} type="text" placeholder="Enter product name" className="w-[60vw] border-2 border-gray-300 p-3" />
          </div>
          {loading && (
            <div className="flex justify-center items-center">
              <svg width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"></animate>
                  <animate attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate>
                </circle>
              </svg>
            </div>
          )}
          <div className="dropdownContainer w-[100vw flex justify-center">
            <div className="dropContainer w-full md:w-[90vw] border border-purple-100 bg-purple-100 rounded-md pl-9">
              {dropdown.map(item => (
                <div key={item._id} className="flex justify-between items-center p-2 border-b">
                  <span className="slug">{item.slug} ({item.quantity} available for ₹ {item.price})</span>
                  <div className="mx-5">
                    <button onClick={() => { incDecVal("minus", item.slug, item.quantity) }} disabled={loadingaction} className="subtract px-3 py-1 bg-purple-600 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-300">-</button>
                    <span className="quantity mx-3">{item.quantity}</span>
                    <button onClick={() => { incDecVal("add", item.slug, item.quantity) }} disabled={loadingaction} className="add px-3 py-1 bg-purple-600 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-300">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-8 w-full text-center">
          <h1 className="text-4xl font-bold mb-6">Add a Product</h1>
          <form className="max-w-screen-xl mx-auto pt-9 bg-slate-200 rounded-lg" style={{ boxShadow: '5px 5px 10px 2px slate' }}>
            <div className="mb-4">
              <label htmlFor="productName" className="block mb-2 font-bold">Product Name</label>
              <input placeholder="Ex: Blue-shirt-xxl" name="slug" value={productForm?.slug || ""} onChange={handleChange} type="text" id="productName" className="w-full md:w-5/6 border border-black px-4 py-2 rounded-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block mb-2 font-bold">Quantity</label>
              <input placeholder="Enter quantity here" name="quantity" value={productForm?.quantity || ""} onChange={handleChange} type="text" id="quantity" className="w-full md:w-5/6 border border-black px-4 py-2 rounded-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block mb-2 font-bold">Price</label>
              <input placeholder="Enter the price of the product" name="price" value={productForm?.price || ""} onChange={handleChange} type="text" id="price" className="w-full md:w-5/6 border border-black px-4 py-2 rounded-sm" />
            </div>
            <button onClick={addProduct} type="submit" className="bg-blue-800 text-white px-4 py-2 my-10">Add Product</button>
          </form>
        </div>
        <div className="container mx-auto mt-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Display Current Stock</h1>
          <div className="w-full">
          {alertMsg ? <div className="alertmsg">
      <span>Sorry, I am stilll working in this project and this feature is not completed yet!😅😅</span><button className="bg-blue-800 text-white px-4 py-2 my-10" onClick={handleCloseAlert}>Close</button>
    </div>: ""}
            <table className="w-3/4 table-auto mx-auto bg-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Product Name</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left ">Delete</th>
                </tr>
              </thead>
              <tbody>
                {products.map(item => (
                  <tr key={item._id}>
                    <td className="border px-4 py-2">{item.slug}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">{item.price}₹</td>
                    <td className="border px-4 py-2 cursor-pointer text-center" onClick={handleButtonClick}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash text-center" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg></td>
                  </tr>
                ))}
                {/* <span className="price border px-4 py-2 font-extrabold">Total Price</span> */}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
