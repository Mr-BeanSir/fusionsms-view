import router from "./index";

const jumpUri = [
    "/login",
    "/register",
    "/forgot"
]

router.beforeEach((to,from,next) => {
    if (!jumpUri.includes(to.path) && localStorage.getItem("token") == null){
        // window.location.href = "/login"
        next({
            path: "/login"
        })
    }
    if (jumpUri.includes(to.path) && localStorage.getItem("token") !== null){
        next({
            path: "/index"
        })
    }
    if (to.meta.title){
        // @ts-ignore
        document.title = to.meta.title
    }
    next()
})

export default router
