/*Messaging Contact List Component*/
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // Fetch contacts on load
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/contacts`);
      setContacts(res.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      alert("Name and Phone are required");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/contacts`, newContact);
      setContacts([...contacts, res.data]);
      setNewContact({ name: "", phone: "", email: "" });
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/contacts/${id}`);
      setContacts(contacts.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Emergency Contacts
      </h2>

      {/* Add New Contact */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Add Contact</h3>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) =>
              setNewContact({ ...newContact, name: e.target.value })
            }
            className="p-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
            className="p-2 border rounded-lg"
          />

          <input
            type="email"
            placeholder="Email (optional)"
            value={newContact.email}
            onChange={(e) =>
              setNewContact({ ...newContact, email: e.target.value })
            }
            className="p-2 border rounded-lg"
          />

          <button
            onClick={handleAddContact}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Contact
          </button>
        </div>
      </div>

      {/* Contact List */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Saved Contacts</h3>

      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">No emergency contacts saved.</p>
      ) : (
        <ul className="space-y-3">
          {contacts.map((contact) => (
            <li
              key={contact._id}
              className="flex justify-between items-center p-3 border rounded-xl shadow-sm bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">{contact.name}</p>
                <p className="text-gray-600 text-sm">{contact.phone}</p>
                {contact.email && (
                  <p className="text-gray-500 text-sm">{contact.email}</p>
                )}
              </div>

              <button
                onClick={() => handleDelete(contact._id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
