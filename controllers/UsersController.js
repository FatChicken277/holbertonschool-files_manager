import crypto from 'crypto';
import dbClient from '../utils/db';

function toHashPassword(password) {
  return crypto.createHash('sha1').update(password, 'utf-8').digest('hex');
}

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const getUsersQuery = await dbClient.db
      .collection('users')
      .find({ email })
      .toArray();

    if (getUsersQuery.length > 0) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashPassword = toHashPassword(password);

    const addUserQuery = await dbClient.db
      .collection('users')
      .insertOne({ email, password: hashPassword });

    const userToResponse = {
      id: addUserQuery.ops[0]._id,
      email: addUserQuery.ops[0].email,
    };

    return res.status(201).json(userToResponse);
  }
}

module.exports = UsersController;
