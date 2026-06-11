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

exports.getById = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!event) {
      return res.status(404).json({ error: "Evento nao encontrado" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Evento nao encontrado" });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!event) {
      return res.status(404).json({ error: "Evento nao encontrado" });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
