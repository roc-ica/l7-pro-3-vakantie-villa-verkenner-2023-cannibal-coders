import { Ticket } from '../types/ticket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const ticketService = {
  async getTickets(): Promise<Ticket[]> {
    try {
      const response = await fetch(`${API_URL}/tickets.php`);
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch tickets');
      }
      
      return data.tickets || [];
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  async getTicketById(id: number): Promise<Ticket> {
    try {
      const response = await fetch(`${API_URL}/ticket.php?id=${id}`);
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch ticket');
      }
      
      return data.ticket;
    } catch (error) {
      console.error(`Error fetching ticket ${id}:`, error);
      throw error;
    }
  },
  
  async createTicket(ticketData: Omit<Ticket, 'id' | 'created_at'>): Promise<Ticket> {
    try {
      console.log('Submitting ticket:', ticketData); // Debug log
      
      // Use the simplified endpoint for ticket creation
      const response = await fetch(`${API_URL}/create-ticket.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      
      const data = await response.json();
      console.log('Ticket creation response:', data); // Debug log
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to create ticket');
      }
      
      // Return constructed ticket with the data we have
      return {
        id: data.ticket_id,
        property_id: ticketData.property_id,
        user_name: ticketData.user_name,
        question: ticketData.question,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },
  
  async updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket> {
    try {
      const response = await fetch(`${API_URL}/tickets/update.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to update ticket');
      }
      
      return data.ticket;
    } catch (error) {
      console.error(`Error updating ticket ${id}:`, error);
      throw error;
    }
  },
  
  async deleteTicket(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/tickets/delete.php?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to delete ticket');
      }
    } catch (error) {
      console.error(`Error deleting ticket ${id}:`, error);
      throw error;
    }
  },
};
