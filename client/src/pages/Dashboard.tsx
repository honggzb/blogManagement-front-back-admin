import { useEffect, useState } from 'react';
import { DashComments, DashNotes, DashProfile, DashSidebar, DashUsers, DashboardComp } from '../components'
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    //console.log(tabFromUrl)
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      { tab === 'profile' && <DashProfile /> }
      {/* posts... */}
      { tab === 'notes' && <DashNotes /> }
      {/* users */}
      { tab === 'users' && <DashUsers /> }
      {/* comments  */}
      { tab === 'comments' && <DashComments /> }
      {/* dashboard comp */}
      { tab === 'dash' && <DashboardComp /> }
    </div>
  )
}

export default Dashboard
