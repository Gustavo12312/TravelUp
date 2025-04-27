import axios from "axios";



class AuthService {
    login (email, password) {
        return axios
            .post("http://localhost:3000/user/login", {email, password})
            .then (res => {
            if (res.data.token) {
                localStorage.setItem("user", JSON.stringify (res.data));
                window.dispatchEvent(new Event("userAuth"));
            }
            return res.data;
            }, reason => { throw new Error('Utilizador Inválido '); });
    }
    
    register (name, email, password, roleId) {
        return axios
            .post("http://localhost:3000/user/register", {name, email, password, roleId})
            .then (res => {
            if (res.data.token) {
                localStorage.setItem("user", JSON.stringify (res.data));
                window.dispatchEvent(new Event("userAuth"));
            }
            return res.data;
            }, reason => { throw new Error('Utilizador Inválido '); });
        }

    logout() { 
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userAuth"));

        
    }

    getCurrentUser() { return JSON.parse (localStorage.getItem('user')); }
} 

export default new AuthService();