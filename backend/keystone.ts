import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';
import { User } from './schemas/User';
import { Event } from './schemas/Event';
import { Store } from './schemas/Store';
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // TODO: add roles here
    }
});

export default withAuth(config({
server: {
    cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
    }
},
db: {
    adapter: 'mongoose',
    url: databaseURL,
    // TODO: Add data seeding here
},
lists: createSchema({
    //Schema items go in here
    User,
    Event,
    Store
}),
ui: {
    // Show UI only for people who pass this test
    isAccessAllowed: ({ session }) => {
       // console.log(session);
        return !!session?.data;
    },
},
session: withItemData(statelessSessions(sessionConfig), {
    User: `id`
})
}));