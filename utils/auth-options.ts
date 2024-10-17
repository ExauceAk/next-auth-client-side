/* eslint-disable */
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
 // ** Pages
 pages: {
   signIn: "/signin",
 },


 // ** Session Strategy
 session: {
   strategy: "jwt",
   maxAge: 30 * 24 * 60 * 60,
 },


 // ** Secret
 secret: process.env.NEXTAUTH_SECRET,


 // ** Providers
 providers: [
   CredentialsProvider({
     name: "Credentials",
     credentials: {
       email: {
         label: "Email",
         type: "email",
         placeholder: "user@gmail.com",
       },
       password: {
         label: "Password",
         type: "password",
         placeholder: "********",
       },
     },


     async authorize(credentials) {
       const { email, password } = credentials as {
         email: string;
         password: string;
       };


       const response = axios
         .post(`${process.env.API_URL}/users/login`, {
           email,
           password,
         })
         .then(({ data }) => {
           return data;
         })
         .catch((error) => {
           if (error.response.data.statusCode === 401)
             throw new Error(error.response.data.body);
           if (error.response.data.statusCode === 400)
             throw new Error(error.response.data.body);
           if (error.response.status === 500)
             throw new Error("Server Error !");
         });
       return response || null;
     },
   }),
 ],


 // ** Callbacks
 callbacks: {
   async jwt({ token, user }) {
     return { ...token, ...user };
   },
   async session({ session, token }) {
     session.role = await token.body.Role.label;


     session.accessToken = await token.additionnalData;


     return session;
   },
 },


 // ** Debug
 debug: process.env.NODE_ENV === "development",
};
