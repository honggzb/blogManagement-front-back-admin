import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button, Spinner } from 'flowbite-react';
import { CallToAction, CommentSection } from "../components";

const NotePage = () => {
  const { noteSlug } = useParams();
  const { loading, setLoading } = useState<boolean>(false);
  const { error, setError } = useState<boolean>(false);
  const { note, setNote } = useState();
  const [recentNotes, setRecentNotes] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/note/getnotes?slug=${noteSlug}`);
        const data = await res.json();
        if(res.ok) {
          setNote(data.notes[0]);
          setLoading(false);
          setError(false);
        } else {
          setError(true);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log((error as Error).message);
        setError(true);
        setLoading(false);
      }
    };
    fetchNote()
  }, [noteSlug]);

  useEffect(() => {
    try {
      const fetchRecentNotes = async () => {
        const res = await fetch(`/api/note/getnotes?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentNotes(data.notes);
        }
      };
      fetchRecentNotes();
    } catch (error) {
      console.log((error as Error).message);
    }
  }, [])

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'> </h1>
      <Link to={`/search?category=${note && note.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>
          {note && note.category}
        </Button>
      </Link>
      <img src={note && note.image} alt={note && note.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{note && new Date(note.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
            {note && (note.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: note && note.content }}>
      </div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <CommentSection noteId={note._id} />
    </main>
  )
}

export default NotePage
