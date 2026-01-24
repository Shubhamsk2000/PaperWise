import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Workspace from './pages/Workspace.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';
import User_Workspaces from './pages/User_Workspaces.jsx';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-dvh bg-[#121212] w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute w-225 h-225 left-1/3 -top-1/2 -translate-x-1/2
              bg-[radial-gradient(circle,#2a2a2a_40%,#121212)]
              rounded-full blur-3xl">
            </div>
          </div>
          <div className="relative z-10 text-(--primary-text) w-full h-full">
            <NavigationBar />
            <main className='w-full h-screen'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />

                {/* Protected routes */}

                <Route path='/me' element={
                  <ProtectedRoute>
                    <User_Workspaces />
                  </ProtectedRoute>
                } />

                <Route path='/workspaces/:workspaceId' element={
                  <ProtectedRoute>
                    <Workspace />
                  </ProtectedRoute>
                } />

              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider >
  )
}

export default App;