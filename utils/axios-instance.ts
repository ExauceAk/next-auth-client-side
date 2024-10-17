import type { AxiosInstance } from "axios";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";


type AxiosInstanceOptions = {
 withCredentials?: boolean;
};


const axiosInstance = (
 options: AxiosInstanceOptions = { withCredentials: true },
): AxiosInstance => {
 const instance = axios.create();


 instance.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL!;
 instance.defaults.headers.common.Accept = "application/json";
 instance.defaults.headers.common["Content-Type"] = "application/json";


 /**
  * axios request interceptors
  */
 instance.interceptors.request.use(async (request) => {
   const session = await getSession();
  


   if (session)
     request.headers.Authorization = `Bearer ${session?.accessToken}`;


   request.withCredentials = options.withCredentials;


   return request;
 });


 /**
  * axios response interceptors
  */
 instance.interceptors.response.use(
   (response) => response.data,
   (error) => {
     if (error.response.status === 401) signOut({ callbackUrl: "/signin" });
     return Promise.reject(error);
   },
 );


 return instance;
};


export default axiosInstance;