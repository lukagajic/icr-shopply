import './App.css';
import { Container } from 'react-bootstrap';

import Header from "./components/Header";
import Login from './components/pages/Login';
import Register from './components/pages/Register.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import Categories from './components/pages/Categories';
import Category from './components/pages/Category';
import UserProfile from './components/pages/UserProfile';
import UserOrders from './components/pages/UserOrders';
import Logout from './components/pages/Logout';
import ProductDetails from './components/pages/ProductDetails';
import CartDetails from './components/pages/CartDetails';

import AuthContextProvider from './contexts/AuthContext';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminOrdersList from './components/pages/AdminOrdersList';


function App() {
  return (
    <AuthContextProvider>
      <Container fluid>
          <Router>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/categories" exact component={Categories} />
              <Route path="/categories/:categoryId" component={Category} />
              <Route path="/user/profile" exact component={UserProfile} />
              <Route path="/user/orders" component={UserOrders} />
              <Route path="/logout" component={Logout} />
              <Route path="/products/:productId" component={ProductDetails} />
              <Route path="/user/cart" component={CartDetails} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/orders" component={AdminOrdersList} />
            </Switch>
          </Router>
      </Container>
      </AuthContextProvider>
  );
}

export default App;
