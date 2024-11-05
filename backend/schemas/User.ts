import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import 'dotenv/config';

export const cloudinary = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: 'magic-bln/avatars'
}

export const User = list ({
    // access:
    // ui
    fields: {
        name: text({isRequired: true, isUnique: true}),
        email: text({isRequired: true, isUnique: true}),
        password: password(),
        avatar: cloudinaryImage({
            cloudinary,
            label: 'Source'
        })
    }
})