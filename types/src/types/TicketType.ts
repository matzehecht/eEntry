import Joi from 'joi';

interface Valid {
  from: Date;
  until: Date;
}
const validSchema = Joi.object<Valid>({
  from: Joi.date().required(),
  until: Joi.date().min(Joi.ref('from')).required(),
});

export interface BaseTicketType {
  name: string;
  valid: Valid;
}
export const baseTicketTypeSchema = Joi.object<BaseTicketType>({
  name: Joi.string().min(1),
  valid: validSchema,
}).options({ presence: 'required' });

export interface TicketType extends Required<BaseTicketType> {
  id: number;
  image: string | null;
}

export interface DBTicketType extends Omit<TicketType, 'valid'> {
  valid_from: Date;
  valid_until: Date;
}
