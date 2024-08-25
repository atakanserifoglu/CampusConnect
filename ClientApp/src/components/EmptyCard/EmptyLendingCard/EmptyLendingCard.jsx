import React from 'react';
import TemplateCard from '../TemplateCard/TemplateCard.jsx'; 
import AddLendingItemForm from '../../../components/ItemForms/AddLendingItemForm/AddLendingItemForm.jsx';

const EmptyLendingCard = () => {
  const apiUrl = "/LendItem/Add";

  return (
    <TemplateCard 
      AddFunction={apiUrl} 
      FormComponent={AddLendingItemForm} 
    />
  );
};

export default EmptyLendingCard;