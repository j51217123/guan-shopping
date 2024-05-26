import axios from "axios"

export const createUserApi = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/createUserWithAdminRole", { email, password })
    return response.data
}

export const checkAdminApi = async uid => {
    const response = await axios.get(`http://localhost:5000/api/checkAdminClaim/${uid}`)
    return response.data
}