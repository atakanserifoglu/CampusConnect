import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, NavLink } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import api from "../../../utilities/axiosConfig.jsx";
import { useNavigate } from "react-router-dom";

const titleDetails = "Product Details";
const headerMes = "- TITLE: ";
const desMes = "- DESCRIPTION: ";
const priceMes = "- PRICE: ";
const listMes = "- LIST DATE: ";
const ownerMes = "- OWNER: ";

const LostItem = () => {
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  var user = localStorage.getItem('user');
  var userId = JSON.parse(user)?.id;

  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [ownerData, setOwnerData] = useState("");
  const arrowRef = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);  
  };

  useEffect(() => {
    // Fetch product details from your API using Axios
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://bilcampusconnect.azurewebsites.net/api/LostItem/${productId}`
        );
        console.log(response.data.data);
        setProductData(response.data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }

    };

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    // Fetch product details from your API using Axios
    const fetchProductDetails = async () => {
      try {
        console.log("GETTING ownerId", productData?.owner);
        const response = await api.get(
          `/Auth/GetById?id=${productData?.owner}`
        );
        console.log("can I get the user", response.data);
        setOwnerData(response.data);
      } catch (error) {
        console.error("Error getting items", error);
      }

    };

    fetchProductDetails();
  }, [productData]);

  const navigate = useNavigate();

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sales-product-container">
      <div className="header-container">
        <button onClick={() => navigate(-1)} className="go-back-button">
          <IoIosArrowBack />
        </button>
        <div className="details-title">{titleDetails}</div>
      </div>

      <div className="product-details">
        <div className="product-details-left">
          <div className="info-container">
            <div className="label-text">{headerMes}</div>
            <div className="product-info">{productData.title}</div>
          </div>
          <div className="info-container">
            <div className="label-text">{desMes}</div>
            <div className="product-info">{productData.description}</div>
          </div>
          <div className="info-container">
            <div className="label-text">{listMes}</div>
            <div className="product-info">{formatDate(productData.listDate)}</div>
          </div>
          <div className="info-container">
            <div className="label-text">{ownerMes}</div>
            <div className="product-info">{ownerData?.name || 'Loading owner name'}</div>
          </div>
        </div>

        <div className="product-details-right">
          {productData.imageUrl.$values && productData.imageUrl.$values.length > 0 ? (
            <div className="slider-container">
              <div className="slider-flex">
                {productData.imageUrl.$values.length > 1 && (
                  <>
                    <button
                      onClick={() => arrowRef.current.slickPrev()}
                      className="buttons back"
                    >
                      <IoIosArrowBack />
                    </button>
                    <button
                      onClick={() => arrowRef.current.slickNext()}
                      className="buttons forward"
                    >
                      <IoIosArrowForward />
                    </button>
                  </>
                )}
                <Slider ref={arrowRef} {...settings} className="image-container">
                  {productData.imageUrl.$values.map((imgUrl, index) => (
                    <div key={index}>
                      <img src={imgUrl} alt={`Image ${index + 1}`} />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LostItem;
