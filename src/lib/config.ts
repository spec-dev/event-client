import { ev } from './utils/env'

export default {
    HOSTNAME: ev('HOSTNAME', 'events.spec.dev'),
    PORT: ev('PORT', 8888),
    DEBUG: ['true', true].includes(ev('DEBUG')),
}
