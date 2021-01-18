import React, { createContext, Component } from "react";

import { AuthContext } from "./AuthContext";
import axios from "axios";
import constants from "../configuration/constants";

export const CartContext = createContext();

class CartContextProvider extends Component {
    state = {
        cart: null,
        productCount: 0
    }

    /* loadUserCart = () => {
        axios.get(`${constants.API_URL_PREFIX}/users/cart`, {
            headers: {
                'Authorization': `Bearer ${this.context.token}`
            }
        }).then(serverData => {
            this.setState({
                cart: serverData.data,
                productCount: serverData.data.cartProducts.length
            });
        }).catch(err => {
            console.log(err);
        })
    } */

    setCart = (cart) => {
        this.setState({
            cart,
            productCount: cart.cartProducts.length
        })
    }

    render() {
        return (
            <CartContext.Provider value={{...this.state, setCart: this.setCart, loadUserCart: this.loadUserCart}}>
                {this.props.children}
            </CartContext.Provider>
        )
    }
}

export default CartContextProvider;
