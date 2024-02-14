import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useState, useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';


interface FormData {
  username: string;
  email: string;
  password: string;
}

const DashProfile = () => {

  const { currentUser, error, loading } = useSelector((state: RootState) => state.userSlice);
  const { imageFile, setImageFile } = useState<File>();
  const { imageFileUrl, setImageFileUrl } = useState();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<string>('');
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({username: '', email: '', password: ''});
  const [updateUserSuccess, setUpdateUserSuccess] = useState<string>('');
  const [updateUserError, setUpdateUserError] = useState<string>('');
  const filePickerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
 
  const handleImageChange = ((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) { 
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
     }
  });

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setImageFileUploadProgress(progress.toFixed(0));
    }, (error) => {
      setImageFileUploadError('Could not upload image (File must be less than 2MB)');
      setImageFileUploadProgress(0);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageFileUrl(downloadURL);
        setFormData({ ...formData, profilePicture: downloadURL });
        setImageFileUploading(false);
      });
    });
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.id]: e.currentTarget.value });
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure((error as Error).message));
      setUpdateUserError((error as Error).message);
    }
  };
 
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
          <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
          <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
            onClick={() => filePickerRef.current.click()}>
              <CircularProgressbar strokeWidth={5}
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}`}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: { stroke: `rgba(62, 152, 199, ${ imageFileUploadProgress/100 }`}
                }}
               />
              <img src={imageFileUrl || currentUser.profilePicture} alt="user" 
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]
                           ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
          </div>
          {imageFileUploadError && ( <Alert color='failure'> {imageFileUploadError} </Alert>)}
        </div>
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='text' id='password' placeholder='password' onChange={handleChange} />
        <Button type='submit' disabled={loading || imageFileUploading} gradientDuoTone='redToYellow' outline>
           { loading ? 'Loading...' : 'Update'}
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign-out</span>
      </div>
    </div>
  )
}

export default DashProfile
