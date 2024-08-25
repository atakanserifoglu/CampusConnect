import React, { useState, useEffect } from "react";
import { SalesCard } from "../../components/SalesCard/SalesCard.jsx";
import { DonationsCard } from "../../components/DonationsCard/DonationsCard.jsx";
import "./Dashboard.css";
import axios from "axios";
import imageSource from "../../assets/image_filler.png";
import { LendingCard } from "../../components/LendingCard/LendingCard.jsx";
import BorrowCard from "../../components/BorrowedCard/BorrowedCard.jsx";

// Strings and constant values
const borrowedItem = "Borrowed Items";
const savedItem = "My Items";
const itembyYou = "Items You Borrowed";
var user = localStorage.getItem("user");
var userId = JSON.parse(user)?.id;
const Dashboard = () => {
  const [salesitems, setSalesItems] = useState([]);
  const [donationItems, setDonationItems] = useState([]);
  const [lendItems, setLendItems] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [updateBorrowed, setUpdateBorrowed] = useState(false);
  var daysRem = 0;

  useEffect(() => {
    // Fetch data when the component mounts
    axios
      .get(`https://bilcampusconnect.azurewebsites.net/api/GeneralItem/${userId}`)
      .then((response) => {
        // setItems(response.data.data);
        console.log(response.data.data);
        console.log(typeof response.data.data.salesItemList.data.$values )
        setSalesItems(response.data.data.salesItemList.data.$values);
       
        setDonationItems(response.data.data.donationItemList.data.$values);
        setLendItems(response.data.data.lendItemList.data.$values);
        // setItems(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });


  }, []);

  useEffect(() => {
    // Fetch data when the component mounts
    axios.get(`https://bilcampusconnect.azurewebsites.net/api/Debug/GetUserBorrowedItemsWithLendItem?id=${userId}`)

      .then((response) => {
        // setItems(response.data.data);
        console.log("BORROWED ITEMS", response.data.borrowedItems.$values);
        setBorrowedItems(response.data.borrowedItems.$values);
        setUpdateBorrowed(!updateBorrowed);
        // setItems(response.data.data);
      })
     
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [remainingDays, setRemainingDays] = useState(0);


  const calculateRemainingDays = (borrowDateTimeString, loanDuration) => {
    // Convert the string to a Date object
    const borrowDateTime = new Date(borrowDateTimeString);
    const endDate = new Date(borrowDateTime.getTime() + loanDuration * 24 * 60 * 60 * 1000);
    const today = new Date();
    const remainingTime = endDate - today;
    const daysRemaining = Math.max(Math.floor(remainingTime / (1000 * 60 * 60 * 24)), 0);
    console.log("daysRemaining", daysRemaining)
    return daysRemaining;
  };

  useEffect(() => {
    console.log("inside updating days remaining");
    const updatedBorrowedItems = borrowedItems.map(item => {
      const remainingDays = calculateRemainingDays(item.borrowDate, item.lendItem.landDurationDays);
      return {
        ...item,
        remainingDays: remainingDays
      };
    });
  
    // Update the state with the new array
    setBorrowedItems(updatedBorrowedItems);
  
  }, [updateBorrowed]);
  return (
    <div className="App">
      <div className="header-font">{savedItem}</div>
      <div className="sales-cards-container">
        {salesitems.length === 0 && donationItems.length === 0 && lendItems.length === 0 ? (
        <div className="no-items-message">No items found in My Items.</div>
      ) : (
        <>
        {salesitems?.map((item) => (
          <SalesCard
            id={item.id} // Assuming each item has a unique id
            date={new Date(item.listDate).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })}
            title={item.title}
            description={item.description}
            price={item.price}
            image={
              (item.imageUrl && item.imageUrl.$values.length) > 0
                ? item.imageUrl.$values[0]
                : imageSource
            }
            header={item.header}
            isDashboard={true}
          />
        ))}
        {donationItems?.map((item) => (
     
          <DonationsCard
            id={item.id} // Assuming each item has a unique id
            date={new Date(item.listDate).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
            title={item.title}
            description={item.description}
            owner = {item.owner}
            image={
              (item.imageUrl && item.imageUrl.$values.length) > 0
                ? item.imageUrl.$values[0]
                : imageSource
            }
            header = {item.header}
          />
          
        ))}
        {lendItems?.map((item) => (
          <LendingCard
            id={item.id} // Assuming each item has a unique id
            date={new Date(item.listDate).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
            title={item.title}
            description={item.description}
            image={
              (item.imageUrl && item.imageUrl.$values.length) > 0
                ? item.imageUrl.$values[0]
                : imageSource
            }
            price={item.price}
            isDashboard= {true}
            isLent={item.isOnLend}
            header={item.header}
          />
        ))}
        </>
      )}
      </div>
      <div className="header-font">{itembyYou}</div>

     <div className="sales-cards-container">
      
       {borrowedItems?.map((item) => (
          <BorrowCard
            id={item.lendItem.id} // Assuming each item has a unique id
          
            title={item.lendItem.title}
            description={item.lendItem.description}
            price={item.lendItem.price}
            image={
              (item.lendItemimageUrl && item.imageUrl.$values.length) > 0
                ? item.imageUrl.$values[0]
                : imageSource
            }
            header={item.lendItem.header}
            isDashboard={true}
            remainingDays={item.remainingDays}
          />
        ))} 
      </div>  
    </div>
  );
};

export default Dashboard;
