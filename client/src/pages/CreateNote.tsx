import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

interface FormData {
  title: string;
  category: string;
  image: File;
  content: string;
}

const initialFormData = { 
  title: '',
  category: '',
  image: undefined,
  content:  '',
}

const CreateNote = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);
  const [imageUploadError, setImageUploadError] = useState<string>('');
  const [publishError, setPublishError] = useState('');
  const navigate = useNavigate();

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError('');
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(0);
            setImageUploadError('');
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(0);
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/note/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError('');
        navigate(`/note/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a note</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' id='title' required placeholder='Title' 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })} >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Angular</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
          <Button type='button' gradientDuoTone='redToYellow' size='sm' outline
                  onClick={handleUpdloadImage}
                  disabled={imageUploadProgress}>
            {imageUploadProgress ? (
                <div className='w-16 h-16'>
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                </div>
              ) : ( 'Upload Image' )
            }
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img src={formData.image} alt='upload' className='w-full h-72 object-cover' />
        )}
        <ReactQuill theme='snow' required placeholder='Write something...' className='h-72 mb-12'
          onChange={(value) => { setFormData({ ...formData, content: value }); }} />
        <Button type='submit' gradientDuoTone='redToYellow'> Publish </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'> {publishError} </Alert>
        )}
      </form>
    </div>
  )
}

export default CreateNote
