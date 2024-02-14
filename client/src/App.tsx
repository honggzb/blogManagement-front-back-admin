import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import {
  Header, FooterCom,
  PrivateRoute, OnlyAdminPrivateRoute, ScrollToTop
} from './components';
import {
  Home, About,SignUp, Search, SignIn, 
  Dashboard,CreateNote,UpdateNote,Projects,NotePage
} from './pages';

function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        {/* <Route element={<OnlyAdminPrivateRoute />}> */}
          <Route path='/create-note' element={<CreateNote />} />
          <Route path='/update-note/:noteId' element={<UpdateNote />} />
        {/* </Route> */}
        <Route path='/projects' element={<Projects />} />
        <Route path='/note/:noteSlug' element={<NotePage />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}

export default App
