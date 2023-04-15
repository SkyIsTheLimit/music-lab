let session = {
  name: 'Chilling with Friends',
  users: [
    {
      id: 0,
      name: 'John Doe',
      color: 'red',
      points: [],
    },
    {
      id: 1,
      name: 'Jane Doe',
      color: 'green',
      points: [],
    },
    { id: 2, name: 'Bozo Doe', color: 'yellow', points: [] },
    { id: 3, name: 'Doremon Doe', color: 'blue', points: [] },
  ],
  color: 'bg-yellow-400',
};

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return res.json(session);

    case 'POST':
      const { body } = req;
      const { userId, points } = body;

      session.users[userId].points = points;

      return res.json(session);
  }
}
