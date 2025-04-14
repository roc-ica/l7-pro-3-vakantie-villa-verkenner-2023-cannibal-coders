import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaEye, FaTrash, FaSearch, FaSortAmountDown, FaSortAmountUp, 
  FaFilter, FaCheckCircle, FaHourglassHalf, FaClock, FaExclamationTriangle
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { Ticket } from '../../types/ticket';
import { ticketService } from '../../api/ticketService';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/admin/modals/DeleteConfirmationModal';

const AdminTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Ticket>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getTickets();
        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    const filtered = tickets.filter(ticket => 
      ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  const handleSort = (field: keyof Ticket) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredTickets].sort((a, b) => {
      const valueA = a[field] ?? '';
      const valueB = b[field] ?? '';
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTickets(sorted);
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setTicketToDelete(ticket);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete || !ticketToDelete.id) return;

    try {
      setIsDeleting(true);
      await ticketService.deleteTicket(ticketToDelete.id);
      
      // Remove deleted ticket from state
      setTickets(prev => prev.filter(t => t.id !== ticketToDelete.id));
      
      toast.success('Ticket deleted successfully');
      setTicketToDelete(null);
    } catch (err) {
      console.error('Error deleting ticket:', err);
      toast.error('Failed to delete ticket. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setTicketToDelete(null);
  };

  const getSortIcon = (field: keyof Ticket) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FaSortAmountUp className="inline ml-1" /> : <FaSortAmountDown className="inline ml-1" />;
  };

  return (
    <AdminLayout title="Customer Tickets Management">
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-custom-dark">Customer Tickets</h1>
          
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-terra w-full md:w-64"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-custom-terra mb-3"></div>
            <p className="text-custom-charcoal">Loading tickets...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-custom-charcoal">
                {searchTerm ? 'No tickets match your search criteria.' : 'No tickets found.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th 
                        className="py-4 px-6 text-left text-sm font-medium text-gray-500 cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        <span>ID {getSortIcon('id')}</span>
                      </th>
                      <th 
                        className="py-4 px-6 text-left text-sm font-medium text-gray-500 cursor-pointer"
                        onClick={() => handleSort('property_name')}
                      >
                        <span>Property {getSortIcon('property_name')}</span>
                      </th>
                      <th 
                        className="py-4 px-6 text-left text-sm font-medium text-gray-500 cursor-pointer"
                        onClick={() => handleSort('user_name')}
                      >
                        <span>Customer {getSortIcon('user_name')}</span>
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                        <span>Request</span>
                      </th>
                      <th 
                        className="py-4 px-6 text-left text-sm font-medium text-gray-500 cursor-pointer"
                        onClick={() => handleSort('created_at')}
                      >
                        <span>Date {getSortIcon('created_at')}</span>
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 text-custom-dark">#{ticket.id}</td>
                        <td className="py-4 px-6">
                          <Link 
                            to={`/property/${ticket.property_id}`}
                            className="text-custom-terra hover:underline"
                          >
                            {ticket.property_name || `Property #${ticket.property_id}`}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-custom-charcoal">
                          {ticket.user_name}
                        </td>
                        <td className="py-4 px-6 text-custom-charcoal">
                          <div className="max-w-md overflow-hidden text-ellipsis">
                            {ticket.question}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-custom-charcoal whitespace-nowrap">
                          {ticket.created_at ? formatDate(ticket.created_at) : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => {
                                toast.info(`Viewing ticket #${ticket.id} details`);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                              title="View details"
                            >
                              <FaEye />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(ticket)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!ticketToDelete}
        title="Delete Ticket"
        message={`Are you sure you want to delete ticket #${ticketToDelete?.id}? This action cannot be undone.`}
        confirmLabel="Delete Ticket"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </AdminLayout>
  );
};

export default AdminTicketsPage;