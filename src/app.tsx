// App.tsx
import React, { Children } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Home from "./app/page";
import ProductList from "@app/customer/product";
import RootLayout, { MainLayout } from "./layout";
import Login from "@app/login";
import Register from "@app/register";
import Header from "@layouts/main-layout/header";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <RootLayout>
      <BrowserRouter>
        {/* <Layout> */}
        <Routes>
          <Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductList />} />
          </Route>
        </Routes>
        {/* </Layout> */}
      </BrowserRouter>
    </RootLayout>
  );
};

export default App;