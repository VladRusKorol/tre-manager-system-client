import { Route, Routes } from "react-router-dom"
import { AccountingPage } from "../pages/Accounting/AccountingPage"
import { AdministrationPage } from "../pages/Administration/AdministrationPage"

export const AppRouter: React.FC = ()=> {
    return <>
        <Routes>
            <Route path="/accounting" element={<AccountingPage/>} />
            <Route path="/administration" element={<AdministrationPage/>} />
        </Routes>
    </>
}