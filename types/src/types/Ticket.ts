import Joi from 'joi';
import { DBTicketType } from './TicketType';

export interface BaseTicket {
  id: string;
  type: DBTicketType['id'];
}
export const baseTicketSchema = Joi.object<BaseTicket>({
  id: Joi.string().min(1).required(),
  type: Joi.number().integer().positive().required(),
});

type TicketCheckInEvent = 'CHECKIN' | 'CHECKOUT';
type TicketInvalidateEvent = 'INVALIDATE';
export type TicketEventType = TicketCheckInEvent | TicketInvalidateEvent;

type TicketCheckedInState = 'CHECKEDIN' | 'CHECKEDOUT';
type TicketValidState = 'VALID' | 'INVALID';
type TicketState = TicketCheckedInState | TicketValidState;

export interface Ticket extends BaseTicket {
  lastModified: string;
  state: TicketState;
}

export interface DBTicket extends BaseTicket {
  created_at: Date;
}
