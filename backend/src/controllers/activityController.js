import prisma from '../config/db.js';

export const fetchActivities = async (req, res) => {
  const userId = req.userId;
  const { tripId } = req.params;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const activities = await prisma.activity.findMany({
      where: {
        tripId: Number(tripId),
      },
    });

    return res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return res
      .status(500)
      .json({ error: 'Something went wrong while fetching activities' });
  }
};

export const createActivity = async (req, res) => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const activity = await prisma.activity.create({
      data: {
        ...req.body,
      },
    });
    return res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Something went wrong while creating the activity' });
  }
};

export const updateActivity = async (req, res) => {
  const userId = req.userId;
  const { activityId } = req.params;

  const updates = req.body;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const activity = await prisma.activity.findFirst({
      where: { id: Number(activityId) },
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const updatedActivity = await prisma.activity.update({
      where: { id: Number(activityId) },
      data: updates,
    });

    return res.status(200).json(updatedActivity);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Something went wrong while updating the activity' });
  }
};

export const deleteActivity = async (req, res) => {
  const userId = req.userId;
  const { activityId } = req.params;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await prisma.activity.delete({
      where: { id: Number(activityId) },
    });

    return res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Something went wrong while deleting the activity' });
  }
};
