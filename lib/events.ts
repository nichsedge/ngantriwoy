import { EventEmitter } from 'events';

export const queueEvents = new EventEmitter();

export const EVENTS = {
  QUEUE_UPDATED: 'QUEUE_UPDATED',
};
