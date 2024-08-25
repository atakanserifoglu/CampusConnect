import React from 'react';
import TemplateCard from '../TemplateCard/TemplateCard.jsx'; 
import AddSaleItemForm from '../../../components/ItemForms/AddSaleItemForm/AddSaleItemForm.jsx';

const EmptySalesCard = () => {
  const apiUrl = "/SalesItem/Add";

  return (
    <TemplateCard 
      AddFunction={apiUrl} 
      FormComponent={AddSaleItemForm} 
    />
  );
};

export default EmptySalesCard;