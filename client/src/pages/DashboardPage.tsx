import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/notes';

interface Note { _id: string; title: string; content: string; createdAt: string; }
interface UserInfo { _id: string; email: string; name: string; dob: string; token: string; }

const DashboardPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const getAuthHeader = useCallback(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedInfo: UserInfo = JSON.parse(storedUserInfo);
      return { headers: { Authorization: `Bearer ${parsedInfo.token}` } };
    }
    navigate('/');
    return null;
  }, [navigate]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      const config = getAuthHeader();
      if (!config) return;
      setIsLoading(true);
      try {
        const { data } = await axios.get<Note[]>(API_URL, config);
        setNotes(data);
      } catch (err) {
        setError('Could not fetch notes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [getAuthHeader]);

  const handleLogout = () => { localStorage.removeItem('userInfo'); navigate('/'); };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { setError('Title and content cannot be empty.'); return; }
    const config = getAuthHeader();
    if (!config) return;
    try {
      const { data } = await axios.post<Note>(API_URL, { title, content }, config);
      setNotes([data, ...notes]);
      setTitle('');
      setContent('');
    } catch (err) { setError('Could not create the note.'); }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      const config = getAuthHeader();
      if (!config) return;
      try {
        await axios.delete(`${API_URL}/${id}`, config);
        setNotes(notes.filter((note) => note._id !== id));
      } catch (err) { setError('Could not delete the note.'); }
    }
  };

  return (
    <div>
      <header style={styles.header}><h1 style={styles.headerTitle}>Welcome, {userInfo?.name}!</h1><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></header>
      <div style={styles.formContainer}><h2 style={styles.subHeader}>Create a New Note</h2>{error && <p style={styles.error}>{error}</p>}<form onSubmit={handleCreateNote}><input type="text" placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required /><textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} style={styles.textarea} required /><button type="submit" style={styles.createButton}>Save Note</button></form></div>
      <hr style={styles.divider} /><h2 style={styles.subHeader}>Your Notes</h2>
      {isLoading ? <p>Loading notes...</p> : notes.length === 0 ? <p>You have no notes yet.</p> : (<div style={styles.notesGrid}>{notes.map((note) => (<div key={note._id} style={styles.noteCard}><h3 style={styles.noteTitle}>{note.title}</h3><p style={styles.noteContent}>{note.content}</p><div style={styles.noteFooter}><small>{new Date(note.createdAt).toLocaleDateString()}</small><button onClick={() => handleDeleteNote(note._id)} style={styles.deleteButton}>Delete</button></div></div>))}</div>)}
    </div>
  );
};
const styles = { header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }, headerTitle: { margin: 0, fontSize: '1.8rem' }, subHeader: { fontSize: '1.5rem', color: '#333' }, logoutButton: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }, formContainer: { marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }, input: { display: 'block', width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }, textarea: { display: 'block', width: 'calc(100% - 22px)', padding: '10px', minHeight: '120px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', resize: 'vertical' as 'vertical' }, createButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }, divider: { border: 'none', borderTop: '1px solid #eee', margin: '40px 0' }, notesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }, noteCard: { display: 'flex', flexDirection: 'column' as 'column', justifyContent: 'space-between', padding: '20px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', minHeight: '150px' }, noteTitle: { marginTop: 0, marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }, noteContent: { flexGrow: 1, whiteSpace: 'pre-wrap' as 'pre-wrap', wordBreak: 'break-word' as 'break-word' }, noteFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', color: '#666', fontSize: '0.8rem' }, deleteButton: { padding: '5px 10px', backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '4px', cursor: 'pointer' }, error: { color: 'red', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '10px', borderRadius: '4px', marginBottom: '15px' }, };
export default DashboardPage;