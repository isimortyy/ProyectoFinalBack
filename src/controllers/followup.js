import Followup from "../models/followup.js";
import Assignment from '../models/assignment.js';

const followupController = {

  // Listar todos los followups----------------------------------------------------
  listFollowups: async (req, res) => {
    try {
      const followups = await Followup.find();
      console.log("Followup list:", followups);
      res.json(followups);
    } catch (error) {
      console.error("Error listing followups:", error);
      res.status(500).json({ error: "Error listing followups" });
    }
  },

  // Listar un followup ID--------------------------------------------------------
  getFollowupById: async (req, res) => {
    const { id } = req.params;
    try {
      const followup = await Followup.findById(id);
      if (!followup)
        return res.status(404).json({ error: "Followup not found" });

      console.log("Followup found:", followup);
      res.json(followup);
    } catch (error) {
      console.error("Error listing followup by ID:", error);
      res.status(500).json({ error: "Error listing followup by ID" });
    }
  },

  // Listar followups por asignación---------------------------------------------------
  listFollowupsByAssignment: async (req, res) => {
    const { assignment } = req.params;
    try {
      const followups = await Followup.find({ assignment });
      console.log(`Followups for assignment ${assignment}:`, followups);
      res.json(followups);
    } catch (error) {
      console.error(
        `Error listing followups for assignment ${assignment}:`,
        error
      );
      res.status(500).json({
        error: `Error listing followups for assignment ${assignment}`,
      });
    }
  },

  // Listar followups por instructor---------------------------------------------------------
  listFollowupsByInstructor: async (req, res) => {
    const { instructor } = req.params;
    try {
      const followups = await Followup.find({ instructor });
      console.log(`Followups for instructor ${instructor}:`, followups);
      res.json(followups);
    } catch (error) {
      console.error(
        `Error listing followups for instructor ${instructor}:`,
        error
      );
      res.status(500).json({
        error: `Error listing followups for instructor ${instructor}`,
      });
    }
  },

  // Insertar un nuevo followup----------------------------------------------
  insertFollowup: async (req, res) => {
    try {
      const newFollowup = new Followup(req.body);  
      const result = await newFollowup.save();
      console.log("Followup saved:", result);
      res.json(result);
    } catch (error) {
      console.error("Error inserting followup:", error);
      res.status(500).json({ error: "Error inserting followup" });
    }
  },

  // Actualizar un followup por su ID---------------------------------------------------
  updateFollowup: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedFollowup = await Followup.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedFollowup) {
        return res.status(404).json({ error: 'Followup not found' });
      }
  
      console.log("Followup updated:", updatedFollowup);
      res.json(updatedFollowup);
    } catch (error) {
      console.error("Error updating followup:", error);
      res.status(500).json({ error: "Error updating followup" });
    }
  },

  // Activar un followup----------------------------------------------------
  enableFollowup: async (req, res) => {
    const { id } = req.params;
    try {
      const followup = await Followup.findById(id);

      if (!followup) {
        return res.status(404).json({ error: 'Followup no encontrado' });
      }

      // Activar el followup si está desactivado
      if (followup.status !== 1) {
        followup.status = 1;
        await followup.save();
        res.json({ message: 'Followup activado correctamente' });
      } else {
        res.json({ message: 'El followup ya está activado' });
      }
    } catch (error) {
      console.error('Error al activar el followup:', error);
      res.status(500).json({ error: 'Error al activar el followup' });
    }
  },

  // Desactivar un followup----------------------------------------------------
  disableFollowup: async (req, res) => {
    const { id } = req.params;
    try {
      const followup = await Followup.findById(id);

      if (!followup) {
        return res.status(404).json({ error: 'Followup no encontrado' });
      }

      // Desactivar el followup si está activado
      if (followup.status === 1) {
        followup.status = 0;
        await followup.save();
        res.json({ message: 'Followup desactivado correctamente' });
      } else {
        res.json({ message: 'El followup ya está desactivado' });
      }
    } catch (error) {
      console.error('Error al desactivar el followup:', error);
      res.status(500).json({ error: 'Error al desactivar el followup' });
    }
  },
};

export default followupController;

