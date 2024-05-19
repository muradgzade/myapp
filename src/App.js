import React from 'react'
import Layout from './Components/Layout/Layout'
import {Route, Routes} from 'react-router-dom'
import Home from './Home/Home'
import { router } from "./router";

function App() {
  return (
    <div>
     <Layout>
       <Routes>
          {
            router&&router.map((path)=>(
            <Route key={`path ${path.path}`} index element={path.component} path={path.path} />
            ))
          }

        </Routes>
       </Layout>



      
    </div>
  )
}

export default App
