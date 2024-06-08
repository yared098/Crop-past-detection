// import 'font-awesome/css/font-awesome.min.css';
// import './assets/css/app.css';
// import DashboardPage from './pages/DashboardPage';
// import TypographyPage from './pages/TypographyPage'
// import LoginPage from './pages/auth/LoginPage'
// import ResetPassword from './pages/auth/ResetPassword';
// import ProfilePage from './pages/profile/ProfilePage';
// import ChangePasswordPage from './pages/profile/ChangePasswordPage';
// import UserPreferencesPage from './pages/profile/UserPreferencesPage'
// import AdminBlankPage from './pages/AdminBlankPage';
// import AddNewspage from './pages/AddNewspage';
// import RegistrationPage from './pages/auth/RegistrationPage';
// import ShowFarmers from './pages/ShowFarmers';
// import AddReportPage from './pages/AddReportPage';
// import ShowReports from './pages/ShowReports';
// import ShowNews from './pages/ShowNews';
// import ShowDetectPage from './pages/ShowDetectPage';
// import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// function App() {
//   return (
//         <Router>
//             <Routes>
//                 <Route exact path='/' element={<DashboardPage/>} />
//                 <Route exact path='/login' element={<LoginPage/>} />
//                 <Route exact path='/reset-password' element={<ResetPassword/>} />
//                 <Route exact path='/profile' element={<ProfilePage/>} />
//                 <Route exact path='/change-password' element={<ChangePasswordPage/>} />
//                 <Route exact path='/preferences' element={<UserPreferencesPage/>} />
//                 <Route exact path='/typography' element={<TypographyPage/>} />
//                 <Route exact path='/blank-page' element={<AdminBlankPage/>} />
//                 <Route exact path='/add-new' element={<AddNewspage/>} />
//                 <Route exact path='/history-page' element={<AdminBlankPage/>} />
//                 <Route exact path='/report-page' element={<AdminBlankPage/>} />
//                 <Route exact path='/register' element={<RegistrationPage/>} />
//                 <Route exact path='/show-news' element={<ShowNews/>} />
//                 <Route exact path='/show-farmers' element={<ShowFarmers/>} />
//                 <Route exact path='/show-reports' element={<ShowReports/>} />
//                 <Route exact path='/show-detectes' element={<ShowDetectPage/>} />
//                 <Route exact path='/add-report' element={<AddReportPage/>} /> 
//             </Routes>  
//         </Router>
//     )
// }

// export default App;

import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './assets/css/app.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import ResetPassword from './pages/auth/ResetPassword';
import ProfilePage from './pages/profile/ProfilePage';
import ChangePasswordPage from './pages/profile/ChangePasswordPage';
import UserPreferencesPage from './pages/profile/UserPreferencesPage';
import AdminBlankPage from './pages/AdminBlankPage';
import AddNewspage from './pages/AddNewspage';
import RegistrationPage from './pages/auth/RegistrationPage';
import ShowFarmers from './pages/ShowFarmers';
import AddReportPage from './pages/AddReportPage';
import ShowReports from './pages/ShowReports';
import ShowNews from './pages/ShowNews';
import ShowDetectPage from './pages/ShowDetectPage';
import Settings from './pages/Settings.js';
// import { AuthProvider, useAuth } from './AuthContext';
import { AuthProvider ,useAuth} from "./folder/AuthProvider";

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path="/settings" element={Settings} />
          <Route path='/' element={<DashboardPage />} />
          <Route path='/profile' element={<ProfilePage />}  />
          <Route path='/change-password'  element={<ChangePasswordPage />}  />
          <Route path='/preferences'  element={<UserPreferencesPage />}  />
       
          <Route path='/blank-page'  element={<AdminBlankPage />}  />
          <Route path='/add-new'element={<AddNewspage />}  />
          <Route path='/history-page'  element={<AdminBlankPage />}  />
          <Route path='/report-page'  element={<AdminBlankPage />}  />
          <Route path='/show-news' element={<ShowNews />} />
          <Route path='/show-farmers'  element={<ShowFarmers />}  />
          <Route path='/show-reports' element={<ShowReports />}  />
          <Route path='/show-detectes'  element={<ShowDetectPage />}  />
          <Route path='/add-report'  element={<AddReportPage />}  /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
