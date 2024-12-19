import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Register from "./_auth/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import AppContext from "./components/AppContext/AppContext";
import AppRoutes from "./_routes/AppRoutes";
import { store } from "./redux/stores/store";
import { Provider } from "react-redux";
function App() {
    return (
        <main className="main-container" >
            <BrowserRouter>
            <Provider store={store}>
                <AppContext>
                        <div className="child-container">
                            <AppRoutes/>
                        </div>
                </AppContext>
            </Provider>
            </BrowserRouter>
        </main >
    );
}

export default App;
