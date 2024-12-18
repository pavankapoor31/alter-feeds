import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Register from "./_auth/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import AppContext from "./components/AppContext/AppContext";
import AppRoutes from "./_routes/AppRoutes";
function App() {
    return (
        <main className="main-container" >
            <BrowserRouter>
                <AppContext>
                        <div className="child-container">
                            <AppRoutes/>
                        </div>
                </AppContext>
            </BrowserRouter>
        </main >
    );
}

export default App;
