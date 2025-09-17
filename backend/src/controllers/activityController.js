import prisma from '../config/db.js';

export const createActivity = async (req, res) => {
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const activity = await prisma.activity.create({
      data: {
        ...req.body,
      },
    });
    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
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

    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    const updatedActivity = await prisma.activity.update({
      where: { id: Number(activityId) },
      data: {
        ...updates,
      },
    });
    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
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
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error });
  }
};
