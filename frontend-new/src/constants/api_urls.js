// const baseurl="http://localhost:5000/api"
const baseurl="http://3.110.221.225:5000/api"
export const ApiUrls = {
    LOGIN: `${baseurl}/login`,
    REGISTER: `${baseurl}/register`,
    PROFILE: `${baseurl}/profile`,
    DASHBOARD: `${baseurl}/profile`,
    HOME: "/",
    NOT_FOUND: "*",
    FORGET_PASSWORD: `${baseurl}/forget-password`,
    RESET_PASSWORD: `${baseurl}/reset-password`,
    AUTH_USER: `${baseurl}/me`,
    UPDATE_PROFILE: `${baseurl}/update-profile`,
    UPLOAD: `${baseurl}/upload`,
    VERIFY_EMAIL: `${baseurl}/verify-email/`,
    RESEND_VERIFY_EMAIL: `${baseurl}/resend-verify-email`
}   