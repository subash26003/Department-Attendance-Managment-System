import axios from "axios";



const backendURL = import.meta.env.VITE_BACKEND_URL
const api = axios.create({  
    baseURL : backendURL + "/api/faculty"
})

export default api