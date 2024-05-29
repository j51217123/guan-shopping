import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL

export const createUserApi = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/api/createUserWithAdminRole`, { email, password })
    return response.data
}

export const checkAdminApi = async uid => {
    const response = await axios.get(`${API_BASE_URL}/api/checkAdminClaim/${uid}`)
    return response.data
}