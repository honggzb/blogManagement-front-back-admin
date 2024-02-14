import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Navigate, Outlet } from 'react-router-dom';

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state: RootState) => state.userSlice);
  return (currentUser.email !== '' && currentUser.isAdmin) ? <Outlet /> : <Navigate to='/sign-in' />
}

export default OnlyAdminPrivateRoute
