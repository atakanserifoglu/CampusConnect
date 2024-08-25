import React, { useState, useEffect } from "react";
import EmptyDonationsCard from '../../components/EmptyCard/EmptyDonationsCard/EmptyDonationsCard.jsx';
import axios from "axios";
import { DonationsCard } from "../../components/DonationsCard/DonationsCard.jsx";
import "./Donations.css";
import imageSource from "../../assets/image_filler.png";

const header = "Donations";
const Donations = () => {

  const [items, setItems] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All Items');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch data when the component mounts
    axios
      .get("https://bilcampusconnect.azurewebsites.net/api/DonationItem/GetAll")
      .then((response) => {
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
      <div className="donations-cards-container">
        <EmptyDonationsCard></EmptyDonationsCard>
        {filteredItems.map((item) => (
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
      </div>
    </div>
  );
};
  // imageUrl, title, description, date
export default Donations;