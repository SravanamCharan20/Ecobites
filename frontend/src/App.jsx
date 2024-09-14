import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Home from './pages/Home';
import PrivateRoute from './components/Privateroute';
import Header from './components/Header';
import DonorForm from './pages/Donate';
import AvailableFoodList from './pages/Avl';
import Fooddetails from './pages/Fooddetails';
import Addfood from './pages/Addfood';
import Managefood from './pages/Managefood';
// import Managefood from './pages/Managefood';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/' element={<Home />} />
          <Route path='/avl' element={<AvailableFoodList />} />
          <Route path='/donate' element={<DonorForm />} />
          <Route path='/food-details/:id' element={<Fooddetails />} />
          <Route path='/addfood' element={<Addfood />} />
          <Route path='/managefood' element={<Managefood />} />
          {/* <Route path='/managefood' element={<PrivateRoute element={<Managefood />} />} /> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;