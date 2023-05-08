import axios from "axios";

const client = axios.create({
  baseURL: "https://expensify-7psl.onrender.com/api",
  // baseURL: "http://192.168.114.159:5000/api",
});

export default client;
