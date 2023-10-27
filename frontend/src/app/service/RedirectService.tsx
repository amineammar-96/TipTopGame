'use client'
import {useRouter} from "next/router";

const RedirectService = () => {
    const router = useRouter();

    const redirectUserToHomePage = () => {
        const token = localStorage.getItem('loggedInUserToken');
        if (token == null || token == "") {
            router.push("/");
        }
    };

    const redirectAdminToToDashboard = () => {
        const token = localStorage.getItem('loggedInUserToken');
        const role = localStorage.getItem('loggedInUserRole');

        if ((token != null || token != "") && role == "ROLE_ADMIN") {
            console.log("redirecting to store admin dashboard");
            router.push("/dashboard/storeAdmin");
        } else if ((token != null || token != "") && role == "ROLE_STOREMANAGER") {
            console.log("redirecting to storeManager admin dashboard");
            router.push("/dashboard/storeManager");
        } else if ((token != null || token != "") && role == "ROLE_EMPLOYE") {
            console.log("redirecting to storeEmploye dashboard");
            router.push("/dashboard/storeEmploye");
        } else if ((token != null || token != "") && role == "ROLE_BAILIFF") {
            console.log("redirecting to store storeBailiff dashboard");
            router.push("/dashboard/storeBailiff");
        } else if ((token != null || token != "") && role == "ROLE_CLIENT") {
            console.log("redirecting to store client dashboard");
            router.push("/dashboard/client");
        }


    }

    const redirectAdminsUserToLoginPage = () => {
        const token = localStorage.getItem('loggedInUserToken');
        if (token == null || token == "") {
            router.push("/store_login");
        }
    }


    const redirectClientToAppropriatePage = () => {
        const token = localStorage.getItem('loggedInUserToken');
        const firstLogin = localStorage.getItem('firstLoginClientStatus');

        if (token == null || token == ""  ) {
            router.push("/client_login");
        }else if ((token != null && token != "" ) && firstLogin == "true") {
            router.push("/dashboard/client/favoriteStoreSelection");
        }else if (token != null && token != "" && firstLogin == "" && firstLogin == null) {
            router.push("/dashboard/client");
        }
    }


    const redirectClientUserToLoginPage = () => {
        const token = localStorage.getItem('loggedInUserToken');
        if (token == null || token == "") {
            router.push("/client_login");
        }
    }

    return {redirectUserToHomePage, redirectAdminToToDashboard , redirectAdminsUserToLoginPage , redirectClientToAppropriatePage , redirectClientUserToLoginPage};
};

export default RedirectService;
