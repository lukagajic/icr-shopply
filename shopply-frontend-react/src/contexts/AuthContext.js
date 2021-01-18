import React, { createContext, Component } from "react";

export const AuthContext = createContext();

class AuthContextProvider extends Component {

    componentDidMount() {
        const savedState = JSON.parse(localStorage.getItem("state"));
        this.setState({
            ...savedState
        })
    }

    state = {
        isLoggedIn: null,
        token: null,
        email: null,
        userId: null,
        userRole: null
    }

    doLogin = (token, email, userId, userRole) => {
        this.setState({
            isLoggedIn: true,
            token,
            email,
            userId,
            userRole
        });

        const savedState = JSON.stringify(this.state);
        localStorage.setItem("state", savedState);
    }

    doLogout = () => {
        this.setState({
            isLoggedIn: false,
            token: null,
            email: null,
            userId: null,
            userRole: null 
        });

        localStorage.clear();
    }

    render() {
        return (
            <AuthContext.Provider value={{...this.state, doLogin: this.doLogin, doLogout: this.doLogout}}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export default AuthContextProvider;
