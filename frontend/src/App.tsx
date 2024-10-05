import React from 'react';
import Home from "./containers/Home";
import {Route, Routes} from "react-router-dom";
import Register from "./features/users/components/Register";
import Login from "./features/users/components/Login";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}>
                <Route path='/login' element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Route>
        </Routes>
    );
}

export default App;
