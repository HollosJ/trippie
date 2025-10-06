import prisma from '../config/db.js';

export const fetchTrips = async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
    });

    return res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fetchTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.userId;

  try {
    let trip = await prisma.trip.findFirst({
      where: { id: Number(tripId), userId },
    });

    if (!trip)
      return res.status(404).json({ error: 'Trip not found or unauthorized' });

    if (trip.userId !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Return trip without activities
    return res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createTrip = async (req, res) => {
  const userId = req.userId;
  const { name, startDate, endDate, emoji } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const trip = await prisma.trip.create({
      data: {
        name,
        emoji,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(201).json({ trip });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTrip = async (req, res) => {
  const userId = req.userId;
  const { tripId } = req.params;

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!tripId) {
      return res.status(400).json({ error: 'Missing trip ID' });
    }

    const trip = await prisma.trip.findFirst({
      where: { id: Number(tripId), userId },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await prisma.trip.delete({
      where: {
        id: trip.id,
      },
    });

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
