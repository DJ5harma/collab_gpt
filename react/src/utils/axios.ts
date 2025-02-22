import axios from "axios";

export const auth_api = axios.create({
    baseURL: "http://localhost:4000/auth",
});
