import Register from "../models/register.js";
import Modality from "../models/modality.js";
import mongoose, { mongo } from "mongoose";



const controllerRegister = {
    // Listar todos los registros---------------------------------------------------------
    listtheregister: async (req, res) => {
        try {
            const registers = await Register.find();
            console.log('Lista de registros', registers);
            res.json(registers);
        } catch (error) {
            console.log('Error al listar registros', error);
            res.status(500).json({ error: 'Error al listar registros' });
        }
    },

    // Listar por id-----------------------------------------------------------------------
    listtheregisterbyid: async (req, res) => {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)){
            return res.status(400).json({succes: false, error: "id no es valido"})
        }
        try {
            const register = await Register.findById(id);

            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            console.log('Registro encontrado', register);
            res.json(register);
        } catch (error) {
            console.log('Error al listar registro por id', error);
            res.status(500).json({ error: 'Error al listar registro por id' });
        }
    },

    // Listar registro por Id aprendiz-----------------------------------------------------------------
    listtheapprenticebyid: async (req, res) => {
        const { apprentice } = req.params;
        if (!mongoose.isValidObjectId(apprentice)){
            return res.status(400).json({ succes: false, error: "Id del aprendiz no es valido"})
        }
        try {
            const registers = await Register.find({ apprentice });
            console.log(`Lista de aprendices en registros: ${apprentice}`);
            res.json(registers);
        } catch (error) {
            console.log(`Error al listar aprendices en registros: ${apprentice}`, error);
            res.status(500).json({ error: 'Error al listar aprendices en registros' });
        }
    },
  
 // Listar registros por ID de ficha
 listregistersbyfiche: async (req, res) => {
    const { idfiche } = req.params;
    console.log(`ID de ficha recibido: ${idfiche}`);
    
    try {
      const registers = await Register.aggregate([
        {
          $lookup: {
            from: "apprentices",
            localField: "apprentice",
            foreignField: "_id",
            as: "apprentice",
          },
        },
        {
          $unwind: "$apprentice",
        },
 
        {
          $match: {
            "apprentice.fiche.idfiche": new mongoose.Types.ObjectId(idfiche),
          },
        },
        {
          $project: {
            _id: 1,
            idfiche:"$apprentice.fiche",
            apprentice: 1,
            modality: 1,
            startDate:1,
            endDate:1,
            company:1,
            phoneCompany: 1,
            addressCompany:1,
            owner: 1,
            docAlternative:1,
            hour : 1,
            businessProjectHour: 1,
            productiveProjectHour: 1,
            status: 1,
            mailCompany :1,
          },
        },
      ]);

      if ( registers.length ===0 ){
        console.log(` No se encontraron registros para el id de ficha ${idfiche}`)
        return res. status(404).json({ succes: false, message:"No se encontraron registros"})
      }

      console.log(`Registros encontrados: ${JSON.stringify(registers, null, 2)}`);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.log(`Error al listar idfiche en register: ${idfiche}`, error);
      res.status(500).json({ error: "Error al listar idfiche en register" });
    }
  },

    // Listar por modalidad---------------------------------------------------------------
    listthemodalitybyid: async (req, res) => {
       const { modality } = req.params
       try{
        const register = await Register.find({Modality})
        console.log(`Lista de registros por modalidad: ${modality}`);

      if (!register.length) {
        return res.status(404).json({
          success: false,
          error: `No se encontraron registros para la modalidad ${modality}`,
        });
      }

      res.json({ success: true, data: register });
    } catch (error) {
      console.error(`Error al listar registros por modalidad: ${modality}`, error);
      res.status(500).json({
        error: `Error al listar registros por modalidad ${modality}`,
      });
    }
  },


    // Listar los registros por fecha de inicio 
    listregisterstardatebyid: async (req, res) => {
        const { startDate } = req.params; // Obtén el valor de StartDate desde los parámetros de consulta

        try {
            const register = await Register.find({ startDate });
            if (!register.length){
                return res.status(404).json({  error: "No se encontraron registros por fecha de inicio"})
            }

            console.log ("Listar por fecha de inicio")
            res.status(200).json(register);

        } catch (error) {
            console.error('Error al listar los registros por fecha de inicio:', error);
            res.status(500).json({ message: 'Error al listar los registros' });
        }
    },




    // Listar los registros por fecha de finalización
    listregisterenddatebyid: async (req, res) => {
      const { endDate } = req.params;
    try {
      const date = new Date(endDate);
  
      if (isNaN(date)) {
        return res.status(400).json({
          error: "La fecha proporcionada no es válida",
        });
      }
      const registers = await Register.find({
        endDate: {
          $gte: date,
          $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Rango de 1 día
        },
      });
      if (!registers.length) {
        return res.status(404).json({
          error: "No se encontraron registros por fecha de finalización",
        });
      }
      console.log("Listar por fecha de finalización");
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar por fecha de finalización", error);
      res.status(500).json({ error: "Error al listar por fecha de finalización" });
    }
  },


    // Insertar registro-----------------------------------------------------------------
    insertregister: async (req, res) => {
       const {
      apprentice,
      modality,
      startDate,
      company,
      phoneCompany,
      addressCompany,
      owner,
      docAlternative,
      certificationDoc,
      mailCompany,
      judymentPhoto,
      hourProductiveStageApprentice,
      assignment
    } = req.body;
    try {
      const start = new Date(startDate);
      if (isNaN(start)) {
        return res.status(400).json({ message: "startDate no es una fecha válida" });
      }
      const modalityData = await Modality.findById(modality);
      if (!modalityData) {
        return res.status(400).json({ message: "Modalidad no encontrada" });
      }
      const { name } = modalityData;
      const validateInstructors = (requiredInstructors) => {
        if (!assignment || !Array.isArray(assignment)) {
          if (!assignment) return null; // Opcional, no validar si no existe
          return `El campo assignment debe ser un arreglo`;
        }
        const missingInstructors = requiredInstructors.filter(instructor =>
          !assignment.some(item => item[instructor] && item[instructor].length > 0)
        );
        if (missingInstructors.length > 0) {
          return `Se requieren los instructores: ${missingInstructors.join(", ")}`;
        }
        return null;
      };
      let instructorError = null;
      if (name === "PROYECTO EMPRESARIAL" || name === "PROYECTO PRODUCTIVO I+D") {
        instructorError = validateInstructors(["projectInstructor", "technicalInstructor", "followUpInstructor"]);
      } else if (name === "PROYECTO SOCIAL" || name === "PROYECTO PRODUCTIVO") {
        instructorError = validateInstructors(["followUpInstructor", "technicalInstructor"]);
      } else if (["PASANTIA", "VÍNCULO LABORAL", "MONITORIAS", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"].includes(name)) {
        instructorError = validateInstructors(["followUpInstructor"]);
      } else {
        instructorError = validateInstructors(["followUpInstructor"]);
      }
      if (instructorError) {
        return res.status(400).json({ message: instructorError });
      }
      const apprenticeCount = Array.isArray(apprentice) ? apprentice.length : 1;
      const singleApprenticeModalities = ["VÍNCULO LABORAL", "MONITORIAS", "PASANTIA", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"];
      if (singleApprenticeModalities.includes(name) && apprenticeCount !== 1) {
        return res.status(400).json({ message: "Solo se permite 1 aprendiz para esta modalidad" });
      } else if (!singleApprenticeModalities.includes(name) && apprenticeCount < 1) {
        return res.status(400).json({ message: "Se requiere al menos 1 aprendiz para esta modalidad" });
      }
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 6);
      endDate.setDate(endDate.getDate() - 1);
      const newRegister = new Register({
        apprentice,
        modality,
        startDate,
        endDate,
        company,
        phoneCompany,
        addressCompany,
        mailCompany,
        owner,
        docAlternative,
        certificationDoc,
        judymentPhoto,
        hourProductiveStageApprentice,
        assignment
      });
      const createdRegister = await newRegister.save();
      res.status(201).json({ success: true, data: createdRegister });
    } catch (error) {
      console.error("Error al crear registro:", error);
      res.status(400).json({ message: error.message || "Error al crear el registro" });
    }
  },

    // Actualizar registro---------------------------------------------------------------
    
    updateRegisterById: async (req, res) => {
        const { id } = req.params;
        const { apprentice, startDate, company, phoneCompany, addressCompany, owner, hour, businessProjectHour,productiveProjectHour,emailCompany  } = req.body;
        try {
          const register = await Register.findById(id);
          if (!register) {
            return res.status(404).json({ msg: "Registro no encontrado" });
          }
          const modalityData = req.body.modality ? await Modality.findById(req.body.modality) : null;
          if (modalityData && !modalityData) {
            return res.status(400).json({ message: "Modalidad no encontrada" });
          }
          const modality = modalityData || register.modality;
          const { name } = modality;

          const apprenticeCount = Array.isArray(apprentice) ? apprentice.length : 1;
          const singleApprenticeModalities = ["VÍNCULO LABORAL", "MONITORIAS", "PASANTIA", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"];
          if (singleApprenticeModalities.includes(name) && apprenticeCount !== 1) {
            return res.status(400).json({ message: "Solo se permite 1 aprendiz para esta modalidad" });
          } else if (!singleApprenticeModalities.includes(name) && apprenticeCount < 1) {
            return res.status(400).json({ message: "Se requiere al menos 1 aprendiz para esta modalidad" });
          }
    
          let endDate = register.endDate;
          if (startDate) {
            const start = new Date(startDate);
            endDate = new Date(start);
            endDate.setMonth(endDate.getMonth() + 6);
            endDate.setDate(endDate.getDate() - 1);
          }
          const updatedRegister = await Register.findByIdAndUpdate(
            id,
            {
              apprentice,
              startDate,
              endDate,
              company,
              phoneCompany,
              addressCompany,
              owner,
              hour,
              businessProjectHour,
              productiveProjectHour,
              emailCompany
            },
            { new: true }
          );
    
          console.log('Registro actualizado correctamente:', updatedRegister);
          res.json({ success: true, data: updatedRegister });
    
        } catch (error) {
          console.error('Error al actualizar registro:', error);
          res.status(400).json({ error: 'Error al actualizar el registro' });
        }
      },

    //Actualizar registro por modalidad 

    updatemodalityregister: async (req, res) => {
        const { id } = req.params;
        const { modality , docAlternative} = req.body;
        try {
            const updatedModality = await Register.findByIdAndUpdate(id, { modality, docAlternative }, { new: true });
            if (!updatedModality) {
                return res.status(404).json({ message: 'Registro no encontrado' });
            }
            res.json({ success: true, data: updatedModality });
        } catch (error) {
            console.log('Error al actualizar modalidad', error);
            res.status(500).json({ error: 'Error al actualizar modalidad' });
        }
    },

    // Activar y Desactivar registro--------------------------------------------------------
    enableregister: async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findById(id);
    
            if (!register) {
                return res.status(404).json({ error: 'Register not found' });
            }
    
            // Activar el registro si está desactivado
            if (register.status === 0) {
                register.status = 1;
                await register.save();
                res.json({ message: 'Register activated successfully' });
            } else {
                res.json({ message: 'Register is already active' });
            }
        } catch (error) {
            console.error('Error activating register:', error);
            res.status(500).json({ error: 'Error activating register' });
        }
    },

    //y Desactivar

    disableregiste:async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findById(id);
    
            if (!register) {
                return res.status(404).json({ error: 'Register not found' });
            }
    
            // Desactivar el registro si está activado
            if (register.status === 1) {
                register.status = 0;
                await register.save();
                res.json({ message: 'Register deactivated successfully' });
            } else {
                res.json({ message: 'Register is already inactive' });
            }
        } catch (error) {
            console.error('Error deactivating register:', error);
            res.status(500).json({ error: 'Error deactivating register' });
        }
    },

    //listar todas las asignaciones

    listAllAssignments: async (req, res) =>{
      try{
        const register = await Register.find()
        .select ('assignment status')
        .populate('assignment.followUpInstructor.idInstructor', 'name')
        .populate('assignment.technicalInstructor.idInstructor', 'name')
        .populate('assignment.projectInstructor.idInstructor', 'name');

        if(!register.length){
          return res.status(404).json({ success: false , message:"No se encontraron asignaciones"})
        }

        console.log("Lista de asignaciones", register)
        res.json({ success: true, data: register})
      }catch (error){
        console.error ("Error al listar las asignaciones",error)
        res.status(500).json({ success: false, error:"Error al listar asignaciones"})
      }
    },

    // Listar registro por id de instructor de seguimiento

    listRegisterByFollowupInstructor: async (req,res) =>{
      const { idInstructor} = req.params
      if ( !mongoose.isValidObjectId(idInstructor)){
        return res.status(400).json ({ success:false, error:"id de instructor no es valido"})
      }
      try{
        const register = await Register.find({
          'assignment.followUpInstructor.idInstructor': idInstructor
        })

        if (!register.length){
          return res.status(404).json( {success: false, message: "No se encontraron registros para el id de instructor de seguimiento" })
        }

        console.log("Registros encontrados para el instructor", register);
        res.json ({ success: true , data: register})
        
      }catch (error){
      console.error("Error al listar registros por id de instructor de seguimiento", error);
      res.status(500).json({ success: false, error:"Error al listar registros por id de instructor de seguimiento"})
      
        
      }
    },

    // Listar registros por id del instructor tecncico

    listRegisterByTechnicalInstructor: async (req,res) =>{
      const {idInstructor}= req.params
      if(!mongoose.isValidObjectId(idInstructor)){
        return res.status(400).json({ success: false, error:"Id de instructor n oes valido"})
      }

      try{
        const register = await Register.find({
          'assignment.technicalInstructor.idInstructor':idInstructor
        })

        if(!register.length){
          return res.status(404).json({ success:false, message:"No se encontraron registros de el instructor tecnico"})
        }
        console.log("Registros encontrado para el instructor tecnico", register);
        res.json({ success: true, data:register})

      }catch (error){
        console.error("Error al listar registros por ID de instructor tecnico", error);
        res.status(500).json({ success: false, error: "Error al listar registros por Id de instructor tecnico"})
        
      }

    },

    //Listar registro por Id de instructor De proyecto

    listRegisterByProjectInstructor: async (req, res) => {
      const { idInstructor } = req.params;
      if (!mongoose.isValidObjectId(idInstructor)) {
        return res.status(400).json({ success: false, error: "ID de instructor no válido" })
          .populate('idApprentice', 'firstName lastName fiche')
          .populate('idModality', 'name')
      }
      try {
        const registers = await Register.find({
          'assignment.projectInstructor.idInstructor': idInstructor,
        });
  
        if (!registers.length) {
          return res.status(404).json({ success: false, message: "No se encontraron registros para este instructor de Proyecto" });
        }
  
        console.log("Registros encontrados para el instructor de Proyecto", registers);
        res.json({ success: true, data: registers });
      } catch (error) {
        console.error("Error al listar registros por ID de instructor técnico", error);
        res.status(500).json({ success: false, error: "Error al listar registros por ID de instructor técnico" });
      }
    },

    //Buscar registro por ID de instructo en cualquier asignacion

    listRegisterByInstructorInAssignment: async (req, res) => {
      const { idInstructor } = req.params;
      if (!mongoose.isValidObjectId(idInstructor)) {
        return res.status(400).json({ success: false, error: "ID de instructor no válido" });
      }
      try {
        const registers = await Register.find({
          $or: [
            { 'assignment.followUpInstructor.idInstructor': idInstructor },
            { 'assignment.technicalInstructor.idInstructor': idInstructor },
            { 'assignment.projectInstructor.idInstructor': idInstructor }
          ]
        })
        .populate('assignment.followUpInstructor.idInstructor', 'name')
        .populate('assignment.technicalInstructor.idInstructor', 'name')
        .populate('assignment.projectInstructor.idInstructor', 'name');
    
        if (!registers.length) {
          return res.status(404).json({ success: false, message: "No se encontraron registros para este instructor" });
        }
        console.log("Registros encontrados para el instructor", registers);
        res.json({ success: true, data: registers });
      } catch (error) {
        console.error("Error al buscar registros por ID de instructor en asignaciones", error);
        res.status(500).json({ success: false, error: "Error al buscar registros por ID de instructor en asignaciones" });
      }
    },
    
    //Listar registro por id de asignacion

    listRegisterByAssignmentId: async (req, res) => {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, error: "ID de registro no válido" });
      }
      try {
        const register = await Register.findById(id)
          .populate('idModality', 'name')
          .populate('idApprentice', 'firstName lastName email phone')
          .populate('assignment.followUpInstructor.idInstructor', 'name')
          .populate('assignment.technicalInstructor.idInstructor', 'name')
          .populate('assignment.projectInstructor.idInstructor', 'name')
          .exec();
    
        if (!register) {
          return res.status(404).json({ success: false, message: "No se encontró el registro" });
        }
    
        // Devolver directamente el registro completo
        res.json({ success: true, data: register });
    
      } catch (error) {
        console.error("Error al buscar registro por ID:", error);
        res.status(500).json({ success: false, error: "Error al buscar registro por ID" });
      }
    },
    
    //Agregar asignacion
    //viejo

    addAssignment: async (req, res) => {
      const { id } = req.params;
      const { assignment } = req.body;
      try {
          console.log(`Iniciando proceso de asignación para el registro con ID: ${id}`);
          const register = await Register.findById(id);
  
          if (!register) {
              return res.status(404).json({ message: "Registro no encontrado" });
          }
  
          console.log(`Registro encontrado: ${JSON.stringify(register)}`);
          const modalityData = await Modality.findById(register.modality);
  
          if (!modalityData) {
              return res.status(400).json({ message: "Modalidad no encontrada" });
          }
  
          const { name } = modalityData;
          console.log(`Modalidad encontrada: ${name}`);
  
          // Validar requisitos según la modalidad
          if (["PROYECTO EMPRESARIAL", "PROYECTO PRODUCTIVO I+D"].includes(name)) {
              if (!assignment[0]?.followUpInstructor?.length) {
                  return res.status(400).json({ message: "El registro necesita al menos un instructor de seguimiento" });
              }
              if (!assignment[0]?.technicalInstructor?.length) {
                  return res.status(400).json({ message: "El registro necesita al menos un instructor técnico" });
              }
              if (!assignment[0]?.projectInstructor?.length) {
                  return res.status(400).json({ message: "El registro necesita al menos un instructor de proyecto" });
              }
          } else if (["PROYECTO SOCIAL", "PROYECTO PRODUCTIVO"].includes(name)) {
              if (!assignment[0]?.followUpInstructor?.length) {
                  return res.status(400).json({ message: "El registro necesita al menos un instructor de seguimiento" });
              }
              if (!assignment[0]?.technicalInstructor?.length) {
                  return res.status(400).json({ message: "El registro necesita al menos un instructor técnico" });
              }
              if (assignment[0]?.projectInstructor?.length > 0) {
                  return res.status(400).json({ message: "Este tipo de modalidad no permite un instructor de proyecto" });
              }
          }else if (["PASANTIA", "VINCULO LABORAL", "MONITORIAS", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"].includes(name)) {
            if (!assignment[0]?.followUpInstructor?.length) {
                return res.status(400).json({ message: "El registro necesita al menos un instructor de seguimiento" });
            }
            if (assignment[0]?.technicalInstructor?.length > 0) {
                return res.status(400).json({ message: "Este tipo de modalidad no permite un instructor de tecnico" });
            }
            if (assignment[0]?.projectInstructor?.length > 0) {
                return res.status(400).json({ message: "Este tipo de modalidad no permite un instructor de proyecto" });
            }
        }
          // Inicializar asignaciones si no existen
          if (!register.assignment || register.assignment.length === 0) {
              register.assignment = [{}];
          }
          ["followUpInstructor", "technicalInstructor", "projectInstructor"].forEach(field => {
              if (!register.assignment[0][field]) {
                  register.assignment[0][field] = [];
              }
          });
          // Cambiar estado de instructores previos a inactivos
          ["followUpInstructor", "technicalInstructor", "projectInstructor"].forEach(field => {
              if (Array.isArray(register.assignment[0][field])) {
                  register.assignment[0][field].forEach(instructor => {
                      instructor.status = 0;
                  });
              }
          });
  
          await register.save();
          console.log("Instructores previos marcados como inactivos");
  
          // Agregar nuevos instructores y activarlos
          const instructors = [
              ...assignment[0]?.followUpInstructor || [],
              ...assignment[0]?.technicalInstructor || [],
              ...assignment[0]?.projectInstructor || [],
          ];
          for (let instructor of instructors) {
            const { idInstructor, name, email } = instructor;
            const fields = ["followUpInstructor", "technicalInstructor", "projectInstructor"];
            for (let field of fields) {
                if (assignment[0][field]?.some(i => i.idInstructor.toString() === idInstructor)) {
                    const existingInstructor = register.assignment[0][field].find(i => i.idInstructor.toString() === idInstructor);
        
                    if (existingInstructor) {
                        if (existingInstructor.status === 1) {
                            // Verificamos si el estado ya es 1 y detenemos el proceso con un error
                            console.log(`Error: El instructor con ID ${idInstructor} ya está activo en el campo ${field}`);
                            return res.status(400).json({
                                message: `El instructor con ID ${idInstructor} ya está activo en el campo ${field}.`
                            });
                        } else {
                            // Reactivar el instructor si está inactivo
                            existingInstructor.status = 1;
                            console.log(`Reactivando al instructor con ID: ${idInstructor} en el campo ${field}`);
                        }
                    } else {
                        // Si el instructor no existe, se agrega con el estado 1 (activo)
                        register.assignment[0][field].push({ idInstructor, name, email, status: 1 });
                        console.log(`Agregando al instructor con ID: ${idInstructor} en el campo ${field}`);
                    }
                    break; // Sale del ciclo una vez que se haya encontrado y procesado al instructor
                }
            }
        }      
          await register.save();
          console.log("Instructores actualizados y activados correctamente");
  
          return res.status(200).json({ message: "Asignación actualizada correctamente" });
  
      } catch (error) {
          console.error("Error al actualizar la asignación:", error);
          res.status(500).json({ message: error.message || "Error al actualizar la asignación" });
      }
  },
  



    //Actualizar asignacion

    updateAssignment: async (req, res) => {
      const { id } = req.params;
      const { assignment } = req.body;
      try {
        const register = await Register.findById(id);
        if (!register) {
          return res.status(404).json({ message: "Registro no encontrado" });
        }
        if (!register.assignment || register.assignment.length === 0) {
          return res.status(400).json({ message: "No hay asignación para actualizar" });
        }
        const currentAssignment = register.assignment[0];
        const updateInstructorInfo = (type, updatedInstructor) => {
          if (updatedInstructor && updatedInstructor.idInstructor) {
            const activeInstructor = currentAssignment[type].find(
              instructor =>
                instructor.status === 1 &&
                instructor.idInstructor.toString() === updatedInstructor.idInstructor
            );
            if (activeInstructor) {
              activeInstructor.name = updatedInstructor.name || activeInstructor.name;
              activeInstructor.email = updatedInstructor.email || activeInstructor.email;
            } else {
              return false;
            }
          }
          return true;
        };
        let updateSuccess = true;
        if (assignment) {
          if (assignment.followUpInstructor) {
            updateSuccess = updateInstructorInfo("followUpInstructor", assignment.followUpInstructor) && updateSuccess;
          }
          if (assignment.technicalInstructor) {
            updateSuccess = updateInstructorInfo("technicalInstructor", assignment.technicalInstructor) && updateSuccess;
          }
          if (assignment.projectInstructor) {
            updateSuccess = updateInstructorInfo("projectInstructor", assignment.projectInstructor) && updateSuccess;
          }
        }
        if (!updateSuccess) {
          return res.status(400).json({ message: "No se pudo actualizar uno o más instructores. Asegúrese de que estén activos." });
        }
        await register.save();
        res.status(200).json({
          success: true,
          message: "Asignación actualizada correctamente",
          data: register
        });
      } catch (error) {
        console.error("Error al actualizar la asignación:", error);
        res.status(500).json({ message: error.message || "Error al actualizar la asignación" });
      }
    }
}

export default controllerRegister;