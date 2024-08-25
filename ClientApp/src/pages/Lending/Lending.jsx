import React, { useState, useEffect } from "react";
import EmptyLendingCard from '../../components/EmptyCard/EmptyLendingCard/EmptyLendingCard.jsx';
import axios from "axios";
import { LendingCard } from "../../components/LendingCard/LendingCard.jsx";
import "./Lending.css";
import imageSource from "../../assets/image_filler.png";

const header = "Lending";
const Lending = () => {

  const [items, setItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All Items');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch data when the component mounts
    axios
      .get("https://bilcampusconnect.azurewebsites.net/api/LendItem/GetAll")
      .then((response) => {
        console.log(response.data.data.$values);
        setItems(response.data.data.$values);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFilterChange = (tag) => {
    setSelectedTag(tag);
    setShowDropdown(false);
  };

  const tags = ['All Items', ...new Set(items.map(item => item.header))];
  const filteredItems = selectedTag === 'All Items' ? items : items.filter(item => item.header === selectedTag);

  return (
    <div className="app">
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
      <div className="lending-cards-container">
        <EmptyLendingCard></EmptyLendingCard>
        {filteredItems.map((item) => (
          <LendingCard
            id={item.id} // Assuming each item has a unique id
            date={new Date(item.listDate).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
            title={item.title}
            description={item.description}
            owner={item.userId}
            image={
              (item.imageUrl && item.imageUrl.$values.length) > 0
                ? item.imageUrl.$values[0]
                : imageSource
            }
            isDashboard={false}
            header={item.header}
          />
        ))}
      </div>
    </div>
  );
};
  // imageUrl, title, price, description, date
export default Lending;