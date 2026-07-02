module.exports = (model) => ({
  getAll: async (req, res) => {
    try {
      res.json(await model.findAll());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const item = await model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Registro nao encontrado' });
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const item = await model.create(req.body, req.user.id);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const item = await model.update(req.params.id, req.body, req.user.id);
      if (!item) return res.status(404).json({ error: 'Registro nao encontrado' });
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const ok = await model.remove(req.params.id, req.user.id);
      if (!ok) return res.status(404).json({ error: 'Registro nao encontrado' });
      res.json({ ok: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});
