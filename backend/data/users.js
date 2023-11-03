import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('admin', 10),
        isAdmin: true,
    },
    {
        name: 'Dennis Ritchie',
        email: 'dennis@gmail.com',
        password: bcrypt.hashSync('user', 10),
        isAdmin: false,
    },
    {
        name: 'Ken Thompson',
        email: 'ken@gmail.com',
        password: bcrypt.hashSync('user', 10),
        isAdmin: false,
    },
];

export default users;