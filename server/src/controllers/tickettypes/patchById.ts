import { ValidationResult } from 'joi';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { BaseTicketType, baseTicketTypeSchema, TicketType } from '../../types/TicketType';
import { State } from '../../utils/auth';

type PathParams = DefaultContext & {
  params: {
    id: number;
  };
};

export const patchById: Middleware<State, PathParams, TicketType> = async (ctx) => {
  // eslint-disable-next-line no-type-assertion/no-type-assertion
  const { value, error } = baseTicketTypeSchema.options({ presence: 'optional' }).validate(ctx.request.body) as ValidationResult<
    Partial<BaseTicketType>
  >;

  if (error) {
    ctx.status = 400;
    return;
  }

  const { name, valid: { from: valid_from, until: valid_until } = {} } = value;

  const ticketType = await db('ticket_types')
    .where('id', ctx.params.id)
    .update({ name, valid_from, valid_until }, ['id', 'name', 'image', 'valid_from', 'valid_until']);

  if (!ticketType[0]) {
    ctx.status = 404;
    return;
  }

  ctx.body = {
    id: ticketType[0].id,
    image: ticketType[0].image,
    name: ticketType[0].name,
    valid: {
      from: ticketType[0].valid_from,
      until: ticketType[0].valid_until,
    },
  };
};
