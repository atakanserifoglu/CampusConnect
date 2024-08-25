import React, { useState, useEffect } from "react";
import "./AllFoundItems.css";
import { LostCard } from "../../components/LostCard/LostCard.jsx";
import { FoundCard } from "../../components/FoundCard/FoundCard.jsx";
import imageSource from "../../assets/image_filler.png";
import api from "../../utilities/axiosConfig.jsx";

const header = "All Lost and Found Items";

const AllFoundItems = () => {
    const [foundItems, setFoundItems] = useState([]);
    const [lostItems, setLostItems] = useState([]);
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all'); 

    const handleGetAllItems = async () => {
        try {

        const response =  await api.get('/FoundItem/GetAll');
        setFoundItems(response.data.data.$values);
        console.log('found items got successfully', response.data.data.$values);
        
        } catch (error) {
        console.error("Error getting items", error);
        }

        try {

            const response =  await api.get('/LostItem/GetAll');
            setLostItems(response.data.data.$values);
            console.log('lost items got successfully', response.data.data.$values[0]);
            
            } catch (error) {
            console.error("Error getting items", error);
            }
    };
    useEffect(() => {
        handleGetAllItems();
    }, []);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const formatFilterText = (filterValue) => {
        switch(filterValue) {
            case 'all': return 'All Items';
            case 'lost': return 'Lost Items';
            case 'found': return 'Found Items';
            default: return filterValue;
        }
    };

    return (
        <div>
            <div className="found-container">
                <div className="all-found-header">{header}</div>
                <div className="dropdown">
                    <div className="dropdown-text">{formatFilterText(filter)}</div>
                    <div className="dropdown-content">
                        <a href="#" onClick={() => handleFilterChange('all')}>All Items</a>
                        <a href="#" onClick={() => handleFilterChange('lost')}>Lost Items</a>
                        <a href="#" onClick={() => handleFilterChange('found')}>Found Items</a>
                    </div>
                </div>
            </div>
            {filter === 'all' || filter === 'lost' ? (
                <div>
                    <div className="all-laf-sub-title">Lost Items</div>
                    <div className="laf-cards-container">
                        {lostItems?.map((item) => (
                            <LostCard
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
                            (item.imageUrl && item.imageUrl.$values.length > 0)
                                ? item.imageUrl.$values[0]
                                : imageSource
                            }
                        />
                        ))}
                    </div>
                </div>
            ) : null}
            {filter === 'all' || filter === 'found' ? (
                <div>
                    <div className="all-laf-sub-title">Found Items</div>
                    <div className="laf-cards-container">
                        {foundItems?.map((item) => (
                            <FoundCard
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
                                (item.imageUrl && item.imageUrl.$values.length > 0)
                                    ? item.imageUrl.$values[0]
                                    : imageSource
                                }
                        />
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default AllFoundItems;