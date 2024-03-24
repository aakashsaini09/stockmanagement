"use client"
import { useState, useEffect } from "react";
import Header from "./components/Header";
export default function Home() {
  const [productForm, setproductForm] = useState({})
  const [products, setproducts] = useState([])
  const [alert, setalert] = useState("")
  useEffect(() => {
    const fetchProducts = async() => {
      const response = await fetch('/api/product')
      let resJson = await response.json();
      setproducts(resJson.products)
    }
    fetchProducts()
  }, [])
  
  const addProduct = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch('/api/product',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });
      if(response.ok){
        console.log("Product added successfully");
        setalert("Your product has been added!")
        setproductForm({})
      }
      else{
        console.log("Error in Product data");
      }
    } catch(error){
        console.log('Error:', error)
    }
  };



  const handleChange = (e) =>{
    setproductForm({...productForm, [e.target.name]: e.target.value})
  }
  return (
    <>
    <Header/>
    <div className="container bg-red-50 mx-auto">
    <div className="text-green-800 text-center">{alert}</div>
    <h1 className="text-3xl font-bold mb-6">Search a Product</h1>
    <div className="flex mb-6">
      <input type="text" placeholder="Enter a product name" className="flex-1 border border-gray"/>
      <select className="border border-gray-300 px-4 py-2 rounded-r-md" >
        <option value="">calegory 1</option>
        <option value="">calegory 2</option>
      </select>
    </div>
    </div>

    <div className="container bg-red-50 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add a Product</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="productName" className="block mb-2">Product Slug</label>
          <input name="slug" value={productForm?.slug || ""} onChange={handleChange} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2"/>
        </div>
        <div className="mb-4">
          <label htmlFor="productName" className="block mb-2">Quantity</label>
          <input name="quantity" value={productForm?.quantity || ""} onChange={handleChange}  type="text" id="productName" className="w-full border border-gray-300 px-4 py-2"/>
        </div>
        <div className="mb-4">
          <label htmlFor="productName" className="block mb-2">Price</label>
          <input name="price" value={productForm?.price || ""} onChange={handleChange} type="text" id="productName" className="w-2/4 mx-auto border border-gray-300 px-4 py-2"/>
        </div>
    <button onClick={addProduct} type="submit"className="bg-blue-500 text-white px-4 py-2">Add Product</button>
      </form>

      <div className="container my-6 bg-red-50 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Display Current Stock</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Quantitiy</th>
            <th className="px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
        {products.map(item =>{
          return <tr key={item._id}>
            <td className="border px-4 py-2">{item.slug}</td>
            <td className="border px-4 py-2">{item.quantity}</td>
            <td className="border px-4 py-2">{item.price}₹</td>
          </tr>
        })}
          {/* <tr>
            <td className="border px-4 py-2">product B</td>
            <td className="border px-4 py-2">41</td>
            <td className="border px-4 py-2">22$</td>
          </tr> */}

        </tbody>
      </table>
      </div>
    </div>
    </>
 
  );
}
