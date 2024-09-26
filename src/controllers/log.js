import log from "../models/log.js";

const logController = {
 
  // Listar todos los logs---------------------------------------------
  listLogs: async (req, res) => {
    try {
      const log = await logs.find();
      console.log("Log list:", log);
      res.json(log);
    } catch (error) {
      console.error("Error listing logs:", error);
      res.status(500).json({ error: "Error listing logs" });
    }
  },

  // Listar un log por su ID-------------------------------------------
  getLogById: async (req, res) => {
    const { id } = req.params;
    try {
      const log = await logs.findById(id);
      if (!log) return res.status(404).json({ error: "Log not found" });

      console.log("Log found:", log);
      res.json(log);
    } catch (error) {
      console.error("Error listing log by ID:", error);
      res.status(500).json({ error: "Error listing log by ID" });
    }
  },
 // Crear nuevo log-------------------------------------------------
 createLog: async (req, res) => {
  const { users, information, data, hourinstructorproyect, createdAt, updatedAt, status} = req.body;
  try {
    const newLog = new logs({ users, information, data, hourinstructorproyect, createdAt, updatedAt, status});
    const result = await newLog.save();
    console.log("Log created:", result);
    res.json(result);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: "Error creating log" });
  }
},

  // Activar o desactivar un log por su ID--------------------------------------
  enablelogsbyid: async (req, res) => {
    const { id } = req.params;
    try {
        const log = await logs.findById(id);
        if (!log) return res.status(404).json({ error: "Log not found" });

        // Activar el log si está desactivado
        if (log.status === 0) {
            log.status = 1;
            await log.save();
            res.json({ msg: "Log activated successfully" });
        } else {
            res.json({ msg: "Log is already activated" });
        }
    } catch (error) {
        console.error("Error activating log:", error);
        res.status(500).json({ error: "Error activating log" });
    }
},

disablelogsbyid:async (req, res) => {
  const { id } = req.params;
  try {
      const log = await logs.findById(id);
      if (!log) return res.status(404).json({ error: "Log not found" });

      // Desactivar el log si está activado
      if (log.status === 1) {
          log.status = 0;
          await log.save();
          res.json({ msg: "Log deactivated successfully" });
      } else {
          res.json({ msg: "Log is already deactivated" });
      }
  } catch (error) {
      console.error("Error deactivating log:", error);
      res.status(500).json({ error: "Error deactivating log" });
  }
}
};

export default logController;