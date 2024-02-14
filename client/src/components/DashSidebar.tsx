import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { RootState } from '../redux/store';

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.userSlice);
  const [tab, setTab] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'> 
          {/* { currentUser && currentUser.isAdmin && ( */}
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div'>
                Dashboard
              </Sidebar.Item>
            </Link>
          {/* )} */}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark'>
              Profile
            </Sidebar.Item>
          </Link>
          {/* { currentUser.isAdmin && ( */}
            <Link to='/dashboard?tab=notes'>
              <Sidebar.Item active={tab === 'notes'} icon={HiDocumentText} as='div' >
                Notes
              </Sidebar.Item>
            </Link>
          {/* )} */}
          {/* { currentUser.isAdmin && ( */}
            <>
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item active={tab === 'notes'} icon={HiOutlineUserGroup} as='div'>
                  Users
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          {/* )} */}
          <Link to='/dashboard?tab=signout'>
            <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
              Sign out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar