'use client'
import {useRouter} from "next/router";

const LogoutService = () => {
    const router = useRouter();

    const logoutAndRedirectAdminsUserToLoginPage = () => {
        const userRole = localStorage.getItem('loggedInUserRole');
        localStorage.removeItem('loggedInUserToken');
        localStorage.removeItem('loggedInUserRole');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('loggedInUserEmail');
        localStorage.removeItem('selectedMenuItem');
        localStorage.removeItem('firstLoginClientStatus');
        if(userRole != "ROLE_CLIENT"){
            router.push("/store_login");
        }else {
            router.push("/client_login");
        }
    }

    return {logoutAndRedirectAdminsUserToLoginPage};
};

export default LogoutService;
