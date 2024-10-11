import React from 'react';
import Home from "./containers/Home";
import {Route, Routes} from "react-router-dom";
import Register from "./features/users/components/Register";
import Login from "./features/users/components/Login";
import Chat from "./containers/Chat";
import UserCabinet from "./features/users/components/UserCabinet";
import {useAppSelector} from "./app/hook";
import {selectUser} from "./features/users/usersSlice";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute";

function App() {
    const user = useAppSelector(selectUser);

    return (
        <Routes>
            <Route path="/" element={<Home/>}>
                <Route path='/' element={
                    <ProtectedRoute isAllowed={user && Boolean(user)}>
                        <Chat/>
                    </ProtectedRoute>
                }/>
                <Route path='/:id' element={
                    <ProtectedRoute isAllowed={user && Boolean(user)}>
                        <Chat/>
                    </ProtectedRoute>
                }/>
                <Route path='/groups/:id' element={
                    <ProtectedRoute isAllowed={user && Boolean(user)}>
                        <Chat/>
                    </ProtectedRoute>
                }/>
                <Route path='my-cabinet' element={
                    <ProtectedRoute isAllowed={user && Boolean(user)}>
                        <UserCabinet/>
                    </ProtectedRoute>
                }/>
                <Route path='/login' element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Route>
        </Routes>
    );
}

export default App;
