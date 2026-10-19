import 'flag-icons/css/flag-icons.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './Pages/HomePage/Home';
import { Container } from 'react-bootstrap';
import PageLayout from './layout/PageLayout';
import { Route, Routes } from 'react-router';
import Profile from './Pages/profile/Profile';
import SignUp from './Pages/Auth/Signup';
import Login from './Pages/Auth/Login';
import Products from './Pages/Products/Products';
import Verify from './Pages/Auth/Verify';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import Search from './Pages/SearchPage/Search';
import CartPage from './Pages/Cart/CartPage';
import ContactUs from './Pages/Contactus/Contactus';
import Terms from './Pages/Terms/Terms';
import Privacy from './Pages/Privacy/Privacy';
import Favorite from './Pages//Favorites/Favorites';
import Favorites from './Pages//Favorites/Favorites';
import Orders from './Pages/Orders/Orders';
import OrderDetails from './Pages/Orders/OrderDetails';
import Checkout from './Pages/Checkout/Checkout';
import Myproducts from './Pages/Myproducts/Myproducts';

import AdminLogin from './admin/Adminlogin';
import AdminProducts from './admin/AdminProduct/Adminproducts';
import AdminProductForm from './admin/AdminProduct/Adminproductform';
import AdminProductDetails from './admin/AdminProduct/Adminproductdetails';
import AdminCategories from './admin/AdminCategories/Admincategories';
import AdminCategoryForm from './admin/AdminCategories/Admincategoryform';
import AdminCategoryDetails from './admin/AdminCategories/Admincategorydetails';
import AdminOrders from './admin/AdminOrder/Adminorders';
import AdminOrderForm from './admin/AdminOrder/Adminorderform';
import AdminOrderDetails from './admin/AdminOrder/Adminorderdetails';
import AdminRoute from './admin/Adminroute';
import AdminHome from './admin/AdminHome';

const App = () => {
  return (
    <>

    <Routes>
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/" element={<Home />} />
       <Route path="/verify" element={<Verify />} />
        <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<Profile/>} />
       <Route path="/signup" element={<SignUp/>} />
       <Route path="/login" element={<Login/>} />
       <Route path="/products" element={<Products/>} />
         <Route path="/search" element={<Search/>} />
         <Route path="/Myproducts" element={<Myproducts/>} />

         <Route path="/contact-us" element={<ContactUs/>} />
         <Route path="/terms" element={<Terms/>} />
         <Route path="/privacy" element={<Privacy/>} />
         <Route path="/favorites" element={<Favorites/>} />
         <Route path="/orders" element={<Orders/>} />
         <Route path="/orders/:id" element={<OrderDetails />} />
         <Route path="/checkout" element={<Checkout/>} />

         <Route path="/admin/login" element={<AdminLogin />} />
         <Route
           path="/admin"
           element={
             <AdminRoute>
               <AdminHome />
             </AdminRoute>
           }
         />
         <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
         <Route path="/admin/products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
         <Route path="/admin/products/:id" element={<AdminRoute><AdminProductDetails /></AdminRoute>} />
         <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
         <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
         <Route path="/admin/categories/new" element={<AdminRoute><AdminCategoryForm /></AdminRoute>} />
         <Route path="/admin/categories/:id" element={<AdminRoute><AdminCategoryDetails /></AdminRoute>} />
         <Route path="/admin/categories/:id/edit" element={<AdminRoute><AdminCategoryForm /></AdminRoute>} />
         <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
         <Route path="/admin/orders/new" element={<AdminRoute><AdminOrderForm /></AdminRoute>} />
         <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetails /></AdminRoute>} />

    </Routes>

    </>
  )
}

export default App