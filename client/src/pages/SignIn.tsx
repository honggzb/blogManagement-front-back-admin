import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store'
import {
  signinStart,
  signinSuccess,
  signinFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

interface FormData {
  email: string;
  password: string;
}

const SignIn = () => {

  const [formData, setFormData] = useState<FormData>({email: '', password: ''});
  const { loading, error: errorMessage } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.id]: e.currentTarget.value.trim() });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if ( !formData.email || !formData.password) {
       return dispatch(signinFailure('Please fill out all fields.'));
    }
    try {
        dispatch(signinStart());
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(signinFailure(data.message));
        }
        if(res.ok) {
          dispatch(signinSuccess(data));
          navigate('/');
        }
      } catch (error) {
        dispatch(signinFailure((error as Error).message));
      }
  }

  return (
    <div className='min-h-screen mt-20'>
       <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
          {/* left */}
          <div className='flex-1'>
            <Link to='/' className='font-bold dark:text-white text-4xl'>
              <span className='px-2 py-1 bg-gradient-to-r from-gray-300 to-pink-300 rounded-lg text-white'>
                Hong's
              </span> Notes
            </Link>
            <p className='text-sm mt-5 w-[70%]'>
               You can sign in with your email and password or with Google.
            </p>
          </div>
          {/* right */}
          <div className='flex-1'>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput 
                type='email'
                placeholder='Your email'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput 
                type='password'
                placeholder='Your password'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='redToYellow' type='submit' disabled={loading}> 
            {loading ? (
               <>
                <Spinner size='sm' />
                <span className='pl-3'>Loading...</span>
              </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't Have an account?</span>
            <Link to='/sign-up' className='text-blue-500'> Sign Up </Link>
          </div>
          { errorMessage && ( <Alert className='mt-5' color='failure'>  {errorMessage} </Alert>)}
          </div>
      </div>
    </div>
  )
}

export default SignIn
