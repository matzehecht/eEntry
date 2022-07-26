import Joi from 'joi';

export interface BaseEvent {
  date?: string[] | null;
  name?: string | null;
}

export const baseEventSchema = Joi.object<BaseEvent>({
  date: Joi.array().items(Joi.string().isoDate()).allow(null),
  name: Joi.string().min(1).allow(null),
});

export interface Event extends Required<BaseEvent> {
  image: string | null;
}

export interface DBEvent extends Event {}
