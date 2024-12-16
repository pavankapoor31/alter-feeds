import { Routes, Route } from "react-router-dom";
import Register from "./components/_auth/Register";
import RootLayout from "./_root/RootLayout";
import ErrorPage from "./_root/pages/ErrorPage";
import "./index.css";

function App() {
    return (
        <main>
            <Routes>
                <Route path="*" element={<ErrorPage />} />
                <Route path={"/register"} element={<Register />} />
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </main>
    );
}

export default App;