import { ev } from './utils/env'

export default {
    HOSTNAME: ev('HOSTNAME', 'events.spec.dev'),
    PORT: ev('PORT', 9000),
}
