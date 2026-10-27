import axios from "axios";

const campersApi = axios.create({
    baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io",
});

export const getCampers = async (params = {}) => {
    const response = await campersApi.get("/campers", {
        params,
    });

    return response.data;
};

export const getCamperById = async (id) => {
    const response = await campersApi.get(`/campers/${id}`);
    return response.data;
};