import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';

export function ThemeProvider({ children }: { children: React.ReactElement }) {

  const { theme } = useSelector((state: RootState) => state.themeSlice);

  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,52)] min-h-screen'>
        { children }
      </div>
    </div>
  )
}

export default ThemeProvider;
