import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useDispatch } from 'react-redux'
import { useEffect } from "react";
import Example from "./components/example";
import Footer from "./components/footer";
import Header from "./components/header";

// Importar componentes de usuario
import UserList from "./components/user/UserList";
import UserFormCreate from "./components/user/UserFormCreate";
import UserFormEdit from "./components/user/UserFormEdit";

// Importar componentes de casa
import HouseList from "./components/house/HouseList";
import HouseFormCreate from "./components/house/HouseFormCreate";
import HouseFormEdit from "./components/house/HouseFormEdit";

// Importar componentes de autenticacion
import Login from "./components/auth/Login";
import ChangePassword from "./components/auth/ChangePassword";

import { loginSuccess } from "./features/authSlice";
import PrivateRoute from "./components/PrivateRoute";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const sessionData = localStorage.getItem('sessionData');
    if(sessionData) {
      dispatch(loginSuccess(JSON.parse(sessionData)))      
    }
  })

  return (
    <>      
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Rutas Privadas */}
          <Route path="/" element={<PrivateRoute Component={Example} />} />
          <Route path="/user" element={<PrivateRoute Component={UserList} />} />
          <Route path="/user/:id" element={<PrivateRoute Component={UserFormEdit} />} />
          <Route path="/change-password" element={<PrivateRoute Component={ChangePassword} />} />

          {/* Rutas de casas */}
          <Route path="/house" element={<PrivateRoute Component={HouseList} />} />
          <Route path="/house/:code" element={<PrivateRoute Component={HouseFormEdit} />} />
          <Route path="/create-house" element={<PrivateRoute Component={HouseFormCreate} />} />

          {/* Rutas Publicas */}
          <Route path="/create-user" element={<UserFormCreate />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
