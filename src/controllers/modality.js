import Modality from "../models/modality.js";

const modalityController = {



  // Listar todas las modalidades
  listModalities: async (req, res) => {
    try {
      const modalities = await Modality.find();
      console.log("Modality list:", modalities);
      res.json(modalities);
    } catch (error) {
      console.error("Error listing modalities:", error);
      res.status(500).json({ error: "Error listing modalities" });
    }
  },

  // Listar una modalidad por su ID
  getModalityById: async (req, res) => {
    const { id } = req.params;
    try {
      const modality = await Modality.findById(id);

      if (!modality) {
        return res.status(404).json({ error: "Modality not found" });
      }

      console.log("Modality found:", modality);
      res.json(modality);
    } catch (error) {
      console.error("Error listing modality by ID:", error);
      res.status(500).json({ error: "Error listing modality by ID" });
    }
  },
    // Crear nueva modalidad
    createModality: async (req, res) => {
      const { name, hourinstructorfollow, hourinstructortechnical, hourinstructorproyect } = req.body;
      try {
        const newModality = new Modality({
          name,
          hourinstructorfollow,
          hourinstructortechnical,
          hourinstructorproyect,
        });
        const result = await newModality.save();
        console.log("Modality created:", result);
        res.json(result);
      } catch (error) {
        console.error("Error creating modality:", error);
        res.status(500).json({ error: "Error creating modality" });
      }
    },

  // Editar una modalidad por su ID
  editModality: async (req, res) => {
    const { id } = req.params;
    const { name, hourinstructorfollow, hourinstructortechnical, hourinstructorproyect, createdAt, updatedAt, estado } = req.body;
    try {
      const result = await Modality.findByIdAndUpdate(
        id,
        { name, hourinstructorfollow, hourinstructortechnical, hourinstructorproyect },
        { new: true }
      );

      if (!result) {
        throw new Error("Modality not found");
      }

      console.log("Modality edited:", result);
      res.json(result);
    } catch (error) {
      console.error("Error editing modality:", error);
      res.status(500).json({ error: "Error editing modality" });
    }
  },


  // Activar o desactivar una modalidad por su ID
  enablemodalitybyid:  async (req, res) => {
    const { id } = req.params;
    try {
        const modality = await Modality.findById(id);
        if (!modality) {
            return res.status(404).json({ error: "Modality not found" });
        }

        // Activar la modalidad si está desactivada
        if (modality.estado === 0) {
            modality.estado = 1;
            await modality.save();
            res.json({ msg: "Modality activated correctly" });
        } else {
            res.json({ msg: "Modality is already activated" });
        }
    } catch (error) {
        console.error("Error activating modality:", error);
        res.status(500).json({ error: "Error activating modality" });
    }
},

disablemodalitybyid:async (req, res) => {
  const { id } = req.params;
  try {
      const modality = await Modality.findById(id);
      if (!modality) {
          return res.status(404).json({ error: "Modality not found" });
      }

      // Desactivar la modalidad si está activada
      if (modality.estado === 1) {
          modality.estado = 0;
          await modality.save();
          res.json({ msg: "Modality deactivated correctly" });
      } else {
          res.json({ msg: "Modality is already deactivated" });
      }
  } catch (error) {
      console.error("Error deactivating modality:", error);
      res.status(500).json({ error: "Error deactivating modality" });
  }
}

};

export default modalityController;