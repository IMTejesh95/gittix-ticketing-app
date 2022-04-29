import axios from "axios";

const axiosClient = ({ req }) => {
  if (typeof window === "undefined") {
    console.log("On server");
    return axios.create({
      baseURL: "http://ingress-svc",
      headers: req.headers,
    });
  } else {
    console.log("On client browser");
    return axios.create();
  }
};

export default axiosClient;
