import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-v3.mbta.com",
});
