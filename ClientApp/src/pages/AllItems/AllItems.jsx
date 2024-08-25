import React, { useState, useEffect } from "react";
import "./AllItems.css"
import api from "../../utilities/axiosConfig.jsx";
import imageSource from "../../assets/image_filler.png";
import { LendingCard } from "../../components/LendingCard/LendingCard.jsx";
import { SalesCard } from "../../components/SalesCard/SalesCard.jsx";
import { DonationsCard } from "../../components/DonationsCard/DonationsCard.jsx";

const header = "All Items";

const AllItems = () => {

    const [donationItems, setDonationItems] = useState([]);
    const [salesItems, setSalesItems] = useState([]);
    const [lendItems, setLendItems] = useState([]);
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all'); 

    const handleGetAllItems = async () => {
        try {

            const response =  await api.get('/DonationItem/GetAll');
            setDonationItems(response.data.data.$values);
            console.log('donations items got successfully', response.data.data.$values);
        
        } catch (error) {
            console.error("Error getting items", error);
        }

        try {
            const response =  await api.get('/SalesItem/GetAll');
            setSalesItems(response.data.data.$values);
            console.log('sales items got successfully', response.data.data.$values);
            
        } catch (error) {
            console.error("Error getting items", error);
        }

        try {
            const response =  await api.get('/LendItem/GetAll');
            setLendItems(response.data.data.$values);
            console.log('lend items got successfully', response.data.data.$values);
            
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
            case 'sales': return 'Sales';
            case 'lend': return 'Lend';
            case 'donation': return 'Donation';
            default: return filterValue;
        }
    };

    return (
        <div>
            <div className="all-container">
                <div className="all-header">{header}</div>
                <div className="dropdown-all">
                    <div className="dropdown-all-text">{formatFilterText(filter)}</div>
                    <div className="dropdown-all-content">
                        <a href="#" onClick={() => handleFilterChange('all')}>All Items</a>
                        <a href="#" onClick={() => handleFilterChange('sales')}>Sales Items</a>
                        <a href="#" onClick={() => handleFilterChange('lend')}>Lend Items</a>
                        <a href="#" onClick={() => handleFilterChange('donation')}>Donation Items</a>
                    </div>
                </div>
            </div>
            {filter === 'all' || filter === 'sales' ? (
                <div>
                    <div className="all-sub-title">Sales Items</div>
                    <div className="all-cards-container">
                        {salesItems.length === 0 ? (
                            <div className="no-items-message">No sales items found.</div>
                        ) : (
                            salesItems.map((item) => (
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
                            ))
                        )}
                    </div>
                </div>
            ) : null}
            {filter === 'all' || filter === 'lend' ? (
                <div>
                    <div className="all-sub-title">Lend Items</div>
                    <div className="all-cards-container">
                        {lendItems.length === 0 ? (
                            <div className="no-items-message">No lend items found.</div>
                        ) : (
                            lendItems.map((item) => (
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
                                />
                            ))
                        )}
                    </div>
                </div>
            ) : null}
            {filter === 'all' || filter === 'donation' ? (
                <div>
                    <div className="all-sub-title">Donation Items</div>
                    <div className="all-cards-container">
                        {donationItems.length === 0 ? (
                            <div className="no-items-message">No donation items found.</div>
                        ) : (
                            donationItems.map((item) => (
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
                            ))
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default AllItems;