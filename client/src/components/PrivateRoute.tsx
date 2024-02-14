import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const { currentUser } = useSelector((state: RootState) => state.userSlice);
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />
  // return currentUser.email !== '' ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
