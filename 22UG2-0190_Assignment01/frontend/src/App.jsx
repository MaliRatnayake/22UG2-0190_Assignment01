import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contacts`);
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const addContact = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      if (res.ok) {
        setName('');
        setPhone('');
        fetchContacts();
      } else {
        setError('Failed to add contact');
      }
    } catch {
      setError('Failed to add contact');
    }
  };

  const deleteContact = async (id) => {
    try {
      await fetch(`${API_BASE}/api/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch {
      setError('Failed to delete');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Contact Manager App by 22UG2-0190</h1>
        <p>Store name & phone — persistent with PostgreSQL</p>
      </header>

      <main>
        <form className="card form" onSubmit={addContact}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone"
            required
          />
          <button type="submit">Add Contact</button>
        </form>

        <section className="card list">
          <h2>Contacts</h2>
          {loading && <p>Loading…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && contacts.length === 0 && <p>No contacts yet.</p>}
          <ul>
            {contacts.map(c => (
              <li key={c.id}>
                <div>
                  <strong>{c.name}</strong><br/>
                  <span className="phone">{c.phone}</span>
                </div>
                <div>
                  <button className="delete" onClick={() => deleteContact(c.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <small>Built for CCS3308 assignment</small>
      </footer>
    </div>
  );
}

