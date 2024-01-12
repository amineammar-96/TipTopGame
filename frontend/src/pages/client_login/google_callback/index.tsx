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
    console.log("code is: " + code);
    if (code) {
      setLoading(true);
      googleLoginCallBack(code).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
        setError(err);
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