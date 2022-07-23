import { DBTicket, TicketEventType } from './Ticket';

export interface DBTicketEvent {
  event: TicketEventType;
  id: number;
  ticket_id: DBTicket['id'];
  time: Date;
}
