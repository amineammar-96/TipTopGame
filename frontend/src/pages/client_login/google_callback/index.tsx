"use strict";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {googleLoginCallBack} from "@/app/api";

const GoogleCallback = () => {
  const router = useRouter();
  const { code } = router.query;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code) {
      console.log("code is: " + code);
      setLoading(true);
      googleLoginCallBack(code).then((res) => {
        let user = res.user;
        let token = res.token;

        let message = res.message;
        let firstLogin = "false";

        if(message == "created"){
            firstLogin = "true";
        }

        console.log("res: ", res);
        console.log("user: ", user);
        console.log("token: ", token);
        console.log("message: ", message);

        localStorage.setItem('loggedInUserToken', token);
        localStorage.setItem('firstLoginClientStatus', firstLogin);
        localStorage.setItem("loggedInUserId", user.id);
        localStorage.setItem("loggedInUserEmail", user.email);
        localStorage.setItem("loggedInUserRole", user.role);
        localStorage.setItem("loggedInUser", JSON.stringify(user));


        let userStore = user.store;
        if(!userStore){
            window.location.href = '/dashboard/client/complete_profile';
        }else {
          window.location.href = '/dashboard/client';
        }


        console.log(res);
      }).catch((err) => {
        console.log(err);
        setError(err);
        window.location.href = '/client_login';
      });
    }else {
        setError("No code provided");
        //router.push('/client_login').then(r => console.log(r));
    }
  }, [code]);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loading && <p>Loading...</p>}
      {error && <p>{
        error == "No code provided" ? "No code provided" : "An error occurred while logging in"
      }</p>}
    </div>
  );
};

export default GoogleCallback;