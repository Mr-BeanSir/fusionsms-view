import axios from "axios";
import {ElNotification} from "element-plus";
import 'element-plus/es/components/notification/style/css'

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 60000,
})

service.interceptors.request.use(
    (req) => {
        if (localStorage.getItem("token")){
            req.headers.set("Authorization",localStorage.getItem("token"))
        }
        return req
    },
    (err) => {
        return Promise.reject(err)
    }
)

service.interceptors.response.use(
    (req) => {
        return req
    },
    (err) => {
        if (err.response.data.status === "-101"){
            localStorage.removeItem("token")
            location.href = "/login"
        }
        ElNotification({
            title: '错误',
            message: err.response.data.msg,
            type: 'error',
        })
        return Promise.reject(err)
    }
)

export default service