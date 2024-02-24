import { useState, useEffect } from "react";
import axios from "axios";
export default function Product(){
    const [product, setProduct]=useState([])
    useEffect(()=>{
        console.log("request to api")
        axios.get("http://127.0.0.1:5000/products")
        .then(Response=>setProduct(Response.data))
        .catch(error => {
            console.error("Error fethching data:' ,error");
        })
    },[])
    const productList=product.map(p=><li key={p.id}>{p.id}
    {p.name} <img src={p.img}/> {p.price}</li>)
    return (<>
        <ul>
            {productList}
        </ul>
    </>)
}