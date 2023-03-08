import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

function Product2() {

    const [products, setProducts] = useState([]);
    const [more, setMore] = useState(true);
    const [page, setPage] = useState(0);

    const elementRef = useRef(null);

    function onIntersection(entries) {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && more) {
            fetchMoreItems()
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection);
        if (observer && elementRef.current) {
            observer.observe(elementRef.current);
        }
        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    }, [products])

    async function fetchMoreItems() {
        try {
            const response = await axios.get(`https://dummyjson.com/products?limit=10&skip=${page * 10}`);
            if (response.data.products.length === 0) {
                setMore(false);
            } else {
                setProducts(prevProducts => [...prevProducts, ...response.data.products]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <div className='container'>
                {
                    products.map((item) => {
                        return <div className='row mt-4'>
                            <div className='col-md-3'></div>
                            <div className='col-md-6'>
                                <div class="card mb-2" key={item.id}>
                                    <div class="card-header">
                                        {item.title}
                                    </div>
                                    <div class="card-body">
                                        <blockquote class="blockquote mb-0">
                                            <img src={item.thumbnail} alt="Product Image" style={{ width: "100px", margin: "10px" }} />
                                            <p>{item.description}</p>
                                            <footer class="blockquote-footer"><cite title="Source Title">$</cite>{item.price}</footer>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>

            {
                more && <div ref={elementRef} style={{ textAlign: "center" }}>Loading...<div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div></div>
            }
        </>
    )
}

export default Product2