import Router from "next/router"
import jsCookie from "js-cookie"
import axios from "axios"
import qs from "qs"

export const getToken = () => {
    return jsCookie.get("token")
}

export const getProfile = () => {
    const profile = jsCookie.get("profile")
    return profile ? JSON.parse(profile) : {}
}

export const isLoggedIn = () => {
    return !!jsCookie.get("token")
}

export const logout = () => {
    jsCookie.remove("token")
    jsCookie.remove("profile")
    jsCookie.remove("loginError")
    Router.replace("/login")
}

export const login = async ( { username, password } ) => {
    let message = 'Амжилтгүй. Дахин оролдоно уу.'
    try {
        const respnseEpost = await axios({
            method: "post",
            url: "http://epost.mn/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({
                username: username,
                password: password,
                grant_type: "password",
            }),
        })

        if ( respnseEpost.status === 200 && respnseEpost.data.access_token ) {
            let expiresIn = new Date(new Date().getTime() + 60 * 24 * 14 * 60 * 1000)
            if ( respnseEpost.data.expires_in ) {
                expiresIn = new Date(new Date().getTime() + respnseEpost.data.expires_in * 1000)
            }
            
            /** Sync */
            const response = await axios({
                method: "POST",
                url: process.env.NEXT_PUBLIC_SITE_URL + '/api/ict/' + 'ict/v1/user/sync' ,
                withCredentials: true,
                data: respnseEpost.data
            })

            if ( response && response.data && response.data.success ) {
                jsCookie.set("token", respnseEpost.data.access_token, {expires: expiresIn})
                jsCookie.set("profile", JSON.stringify(respnseEpost.data))
                Router.replace("/profile")
            }
        }
    } catch (error) {
        if ( error.response&&error.response.data&&error.response.data.error_description ) {
            message = error.response.data.error_description
        } else {
            message = 'Алдаа гарлаа. Дахин оролдоно уу.'
        }
    }
    return message
}