import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { RootState } from '../redux/store';

const DashNotes = () => {

  const { currentUser } = useSelector((state: RootState) => state.userSlice);
  const [userNotes, setUserNotes] = useState([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok) {
          setUserNotes(data.notes);
          if(data.notes.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log((error as Error).message);
      }
    }
    if(currentUser.isAdmin) {
      fetchNotes();
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userNotes.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok) {
        setUserNotes((prev) => [...prev, ...data.notes]);
        if(data.notes.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const handleDeleteNote = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/note/deletenote/${noteIdToDelete}/${currentUser._id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserNotes((prev) =>
          prev.filter((note) => note._id !== noteIdToDelete)
        );
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userNotes.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Note image</Table.HeadCell>
                <Table.HeadCell>Note title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell> <span>Edit</span> </Table.HeadCell>
            </Table.Head>
            { userNotes.map((note) => (
                <Table.Body className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/note/${note.slug}`}>
                        <img src={note.image} alt={note.title} className='w-20 h-10 object-cover bg-gray-500' />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='font-medium text-gray-900 dark:text-white' to={`/note/${note.slug}`} >
                        {note.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{note.category}</Table.Cell>
                    <Table.Cell>
                      <span onClick={() => { setShowModal(true); setNoteIdToDelete(note._id); }}
                          className='font-medium text-red-500 hover:underline cursor-pointer' >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='text-teal-500 hover:underline' to={`/update-post/${note._id}`} >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
            ))}
          </Table> 
          { showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              Show more
            </button>
          )}
          <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
              <div className='text-center'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                  Are you sure you want to delete this post?
                </h3>
                <div className='flex justify-center gap-4'>
                  <Button color='failure' onClick={handleDeleteNote}> Yes, I'm sure </Button>
                  <Button color='gray' onClick={() => setShowModal(false)}> No, cancel </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  )
}

export default DashNotes;