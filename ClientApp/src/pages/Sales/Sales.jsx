import React, { useState, useEffect } from "react";
import EmptySalesCard from "../../components/EmptyCard/EmptySalesCard/EmptySalesCard.jsx";
import { SalesCard } from "../../components/SalesCard/SalesCard.jsx";
import "./Sales.css";   
import imageSource from "../../assets/image_filler.png";
import api from "../../utilities/axiosConfig.jsx";

const header = "Second-Hand Sales";

const Sales = () => {
  const [items, setItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All Items');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleGetAllItems = async () => {
    try {

      const response =  await api.get('/SalesItem/GetAll');
      setItems(response.data.data.$values);
      console.log('items got successfully', response.data.data.$values);
     
    } catch (error) {
      console.error("Error getting items", error);
    }
  };

  useEffect(() => {
    handleGetAllItems();
  }, []);

  const handleFilterChange = (tag) => {
    setSelectedTag(tag);
    setShowDropdown(false);
  };

  const tags = ['All Items', ...new Set(items.map(item => item.header))];
  const filteredItems = selectedTag === 'All Items' ? items : items.filter(item => item.header === selectedTag);

  return (
    <div>
      <div className="all-container">
        <div className="header-font">{header}</div>
          <div className="dropdown-sales">
            <div className="dropdown-sales-text" onClick={() => setShowDropdown(!showDropdown)}>
              {selectedTag}
            </div>
            {showDropdown && (
              <div className="dropdown-sales-content">
                {tags.map(tag => (
                  <a href="#" key={tag} onClick={() => handleFilterChange(tag)}>{tag}</a>
                ))}
              </div>
            )}
          </div>
      </div>
      <div className="sales-cards-container">
        <EmptySalesCard></EmptySalesCard>
        {filteredItems.map((item) => (
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
            owner={item.owner}
            image={
              (item.imageUrl && item.imageUrl.$values.length) > 0
                ? item.imageUrl.$values[0]
                : imageSource
            }
            header={item.header}
          />
        ))}
      </div>
    </div>
  );
};
// imageUrl, title, price, description, date
export default Sales;
