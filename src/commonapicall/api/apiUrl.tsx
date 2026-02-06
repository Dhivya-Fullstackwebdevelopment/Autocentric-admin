//API url apiUrl.tsx
import axios from 'axios';

export const apiUrl = {
    //apiUrlConfig: "http://192.168.1.14:8000",
    //apiUrlConfig: "http://103.214.132.20:8007",
    apiUrlConfig: "http://217.154.63.73:8000/",

}

// Create an Axios instance with the base URL
export const apiAxios = axios.create({
    baseURL: apiUrl.apiUrlConfig,
});