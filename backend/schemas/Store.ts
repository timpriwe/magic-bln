import { list } from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import 'dotenv/config';

export const cloudinary = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: 'magic-bln/stores'
}

export const Store = list ({
    // access:
    // ui
    fields: {
        name: text({isRequired: true, isUnique: true}),
        owner: text(),
        tel: text(),
        email: text(),
        adress: text({
            ui: {
                displayMode: 'textarea',
            },
        }),
        openingHours: text({
            ui: {
                displayMode: 'textarea',
            },
        }),
        image: cloudinaryImage({
            cloudinary,
            label: 'Source'
        }),
        events: relationship({
            ref: 'Event.store',
            many: true,
            ui: {
                displayMode: 'cards',
                cardFields: ['name', 'description', 'time', 'format'],
                inlineCreate: { fields: ['name', 'description', 'time', 'format']},
                inlineEdit: { fields: ['name', 'description', 'time', 'format']},
            }
        })
    }
})