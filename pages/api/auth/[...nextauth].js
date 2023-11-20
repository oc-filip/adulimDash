import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verifyPassword } from '../../../utils/auth';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';

dbConnect();

export default NextAuth({
  secret: process.env.JWT_SECRET,
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {


        const user = await User.findOne({username: credentials.username});

        if (!user) {
          throw new Error('Wrong credentials!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Wrong credentials!');
        }

        return { username: user.username };
        
      },
    }),
  ],
});


