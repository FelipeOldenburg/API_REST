const Event = require('../models/Event');

exports.create = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    let filter = {};
    if (req.user) {
      filter.createdBy = req.user.id;
    }
    const events = await Event.find(filter);
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(event);
};

exports.delete = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};