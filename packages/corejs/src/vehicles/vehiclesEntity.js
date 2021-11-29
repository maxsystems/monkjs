import { schema } from 'normalizr';
import entities from '../entities';

export const entity = new schema.Entity('vehicles', {}, entities.options);

export const entityCollection = [entity];