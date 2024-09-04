import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Home from './pages/Home';
import PrivateRoute from './components/Privateroute';
import Avl from './pages/Avl';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/' element={<Home />} />
          <Route path='/avl' element={<Avl />} />
          {/* <Route element={<PrivateRoute />}>
          </Route> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;