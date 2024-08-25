import React from 'react';
import TemplateCard from '../TemplateCard/TemplateCard.jsx'; 
import AddDonationsItemForm from '../../../components/ItemForms/AddDonationsItemForm/AddDonationsItemForm.jsx'; // Adjust the import path as needed

const EmptyDonationsCard = () => {
  const apiUrl = "/DonationItem/Add";

  return (
    <TemplateCard 
      AddFunction={apiUrl} 
      FormComponent={AddDonationsItemForm} 
    />
  );
};

export default EmptyDonationsCard;