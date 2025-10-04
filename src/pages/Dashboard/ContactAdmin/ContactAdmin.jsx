import React, { useState, useEffect } from 'react';
import { Trash2, Mail, Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../hooks/axiosIntance/AxiosIntance';

const ContactAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, replied: 0 });

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/contact');
      const contactsData = res.data.contacts || res.data;
      setContacts(contactsData);
      setFilteredContacts(contactsData);
      
      // Calculate stats
      const total = contactsData.length;
      const unread = contactsData.filter(c => c.status === 'unread').length;
      const read = contactsData.filter(c => c.status === 'read').length;
      const replied = contactsData.filter(c => c.status === 'replied').length;
      setStats({ total, unread, read, replied });
    } catch (err) {
      console.error('Error fetching contacts:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load contacts.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts
  useEffect(() => {
    let filtered = contacts;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
  }, [searchTerm, statusFilter, contacts]);

  // Handle reply (mailto)
// Handle reply (mailto)
const handleReply = async (contact) => {
  const subject = encodeURIComponent(`Re: ${contact.subject}`);
  const body = encodeURIComponent(
    `\n\n---\nOriginal message from ${contact.name}:\n${contact.message}`
  );
  const mailtoLink = `mailto:${contact.email}?subject=${subject}&body=${body}`;

  // Update status first
  try {
    await axiosInstance.patch(`/contact/${contact._id}/status`, { status: "replied" });
    await fetchContacts();
  } catch (err) {
    console.error("Error updating status:", err);
  }

  // Detect device
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    // open Gmail app or default mail app
    window.location.href = mailtoLink;
  } else {
    // open mail in new tab (desktop)
    window.open(mailtoLink, "_blank");
  }
};


  // Mark as read
  const markAsRead = async (contactId) => {
    try {
      await axiosInstance.patch(`/contact/${contactId}/status`, { status: 'read' });
      await fetchContacts();
    } catch (err) {
      console.error('Error marking as read:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update status.',
      });
    }
  };

  // Handle delete
  const handleDelete = async (contactId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this contact message!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setDeleteLoading(prev => ({ ...prev, [contactId]: true }));
      try {
        await axiosInstance.delete(`/contact/${contactId}`);
        setContacts(prev => prev.filter(c => c._id !== contactId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Contact message deleted successfully.',
          timer: 1500,
        });
      } catch (err) {
        console.error('Error deleting contact:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete contact.',
        });
      } finally {
        setDeleteLoading(prev => ({ ...prev, [contactId]: false }));
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      unread: 'bg-blue-100 text-blue-700',
      read: 'bg-yellow-100 text-yellow-700',
      replied: 'bg-green-100 text-green-700'
    };
    return badges[status] || badges.unread;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <span className="text-lg text-gray-600">Loading contacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Messages</h2>
          <button
            onClick={fetchContacts}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Unread</p>
            <p className="text-2xl font-bold text-blue-700">{stats.unread}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-200">
            <p className="text-sm text-yellow-600 mb-1">Read</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.read}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
            <p className="text-sm text-green-600 mb-1">Replied</p>
            <p className="text-2xl font-bold text-green-700">{stats.replied}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table/Cards Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg font-medium mb-2">No contacts found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr 
                    key={contact._id} 
                    className={`hover:bg-gray-50 transition-colors ${contact.status === 'unread' ? 'bg-blue-50' : ''}`}
                    onClick={() => contact.status === 'unread' && markAsRead(contact._id)}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{contact.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{contact.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate" title={contact.message}>
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(contact);
                          }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Reply via Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contact._id);
                          }}
                          disabled={deleteLoading[contact._id]}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                          title="Delete"
                        >
                          {deleteLoading[contact._id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-lg font-medium mb-2">No contacts found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div 
                key={contact._id} 
                className={`p-4 sm:p-5 hover:bg-gray-50 transition-colors ${contact.status === 'unread' ? 'bg-blue-50' : ''}`}
                onClick={() => contact.status === 'unread' && markAsRead(contact._id)}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">{contact.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>

                  {/* Subject */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Subject</h4>
                    <p className="text-sm font-medium text-gray-900">{contact.subject}</p>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Message</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{contact.message}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{formatDate(contact.createdAt)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReply(contact);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Mail className="h-4 w-4" />
                        Reply
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contact._id);
                        }}
                        disabled={deleteLoading[contact._id]}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors text-sm font-medium"
                      >
                        {deleteLoading[contact._id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;