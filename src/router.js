import Home from "./Home/Home";



export const router=[
    {
        id: Math.floor(Math.random()*1000),
        component:<Home/>,
        path:"/",
        names:"Home"
    },
    
]

export default router