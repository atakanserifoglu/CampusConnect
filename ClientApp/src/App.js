import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import AllItems from './pages/AllItems/AllItems.jsx';
import Sales from './pages/Sales/Sales.jsx';
import Messages from './pages/Messages/Messages.jsx';
import Borrowing from './pages/Lending/Lending.jsx';
import BorrowProduct from './pages/ProductPages/BorrowProduct/BorrowProduct.jsx';
import Donations from './pages/Donations/Donations.jsx';
import DonationProduct from './pages/ProductPages/DonationsProduct/DonationProduct.jsx';
import LostSomething from './pages/LostSomething/LostSomething';
import AllFoundItems from './pages/AllFoundItems/AllFoundItems';
import Login from './pages/Login/Login';
import SidebarLayout from './components/Sidebar/SidebarLayout';
import Signup from './pages/Signup/Signup';
import Profile from './pages/Profile/Profile';
import { AuthProvider } from './auth/auth.js';
import PrivateRoutes from './utilities/PrivateRoutes.jsx';
import SalesProduct from './pages/ProductPages/SalesProduct/SalesProduct.jsx';
import Settings from './pages/Settings/Settings.jsx';
import DeleteUser from './pages/Settings/DeleteUser/DeleteUser.jsx';
import ChangePassword from './pages/Settings/ChangePassword/ChangePassword.jsx';
import { MobileProvider } from './mobileContext/mobileContext.jsx';
import FoundProduct from './pages/ProductPages/FoundProduct/FoundProduct.jsx';
import LostItem from './pages/ProductPages/LostProduct/LostItem.jsx';

const App = () => {

  return (
   
    <AuthProvider>
      <MobileProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<SidebarLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/allitems" element={<AllItems />} />
                <Route path="/borrowing" element={<Borrowing />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/lost-something" element={<LostSomething />} />
                <Route path="/all-found-items" element={<AllFoundItems />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/delete-user" element={<DeleteUser />} />
                <Route path="/settings/change-password" element={<ChangePassword />} />
                <Route path="/sales-product/:productId" element={<SalesProduct />} />
                <Route path="/lost-product/:productId" element={<LostItem />} />
                <Route path="/found-product/:productId" element={<FoundProduct />} />
                <Route path="/donation-product/:productId" element={<DonationProduct />} />
                <Route path="/borrow-product/:productId" element={<BorrowProduct />} />
                <Route path="/messages/:messageId" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </MobileProvider>
    </AuthProvider>

  );
};

export default App;