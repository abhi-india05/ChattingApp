import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import SignUp from "./pages/SignUp.jsx";
import UserPage from "./pages/UserPage.jsx";


function App() {
return(
<Routes>
  <Route path='/login' element={<LoginPage/>}/>
  <Route path='/signup' element={<SignUp/>}/>
  <Route path='/user/:username' element={<UserPage/>}/>
  

</Routes>
)

;
}

export default App
