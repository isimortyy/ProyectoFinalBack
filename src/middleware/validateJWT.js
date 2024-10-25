import jwt from 'jsonwebtoken';
import axios from 'axios';

const REPFORA = process.env.REPFORA;

const validate =  {

    validateJWT: async (req, res, next) => {
        const { token } = req.headers;
    
        console.log("Token Capturado:", token);
    
        if (!token) {
            return res.status(401).json({
                msg: 'Token no proveído'
            });
        }
    
        try {
            const validate = await axios.post(`${REPFORA}/api/users/token/productive/stages`, null, {
                headers: { token: token }
            });
    
            console.log("Respuesta del Api:", validate.data);
    
            if (validate.data.token === true) {
                console.log('Validación correcta:', validate.data);
                
        
                req.userData = validate.data;
    
                return next();
            } else {
                return res.status(400).json({
                    msg: 'Token inválido',
                    data: validate.data
                });
            }
        } catch (error) {
            return res.status(error.response?.status || 500).json({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    }, 

    validateInstructors: async (req, res, next) => {
        const { token } = req.headers;
    
        console.log("Token Capturado:", token);
    
        if (!token) {
            return res.status(401).json({
                msg: 'Token no proveído'
            });
        }
    
        try {
            const validate = await axios.post(`${REPFORA}/api/users/token/productive/stages`, null, {
                headers: { token: token }
            });
    
            console.log("Respuesta del Api:", validate.data);
    
            if (validate.data.token === true) {
                console.log('Validación correcta:', validate.data);
                
        
                req.userData = validate.data;
    
                return next();
            } else {
                return res.status(400).json({
                    msg: 'Token inválido',
                    data: validate.data
                });
            }
        } catch (error) {
            return res.status(error.response?.status || 500).json({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    },
    generarJWT: (uid) => {
        return new Promise((resolve, reject) => {
          const payload = { uid };
          jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d" 
          }, (err, token) => {
            if (err) {
              reject("No se pudo generar el token");
            } else {
              resolve(token);
            }
          });
        });
      },
    
        validateJWTA: async (req, res, next) => {
        const token = req.header("x-token");
      
        // Verificar si el token está presente en la petición
        if (!token) {
          return res.status(401).json({
            msg: "No hay token en la petición"
          });
        }
      
        try {
          // Verificar el token y extraer el UID
          const { uid } = jwt.verify(token, process.env.JWT_SECRET);
      
          // Buscar al usuario en la base de datos por el UID
          const usuario = await Apprentice.findById(uid);
      
          // Verificar si el usuario existe en la base de datos
          if (!usuario) {
            return res.status(401).json({
              msg: "Token no válido - usuario no existe en la DB"
            });
          }
      
          // Verificar si el usuario está activo
          if (usuario.Estado === 0) {
            return res.status(401).json({
              msg: "Token no válido - usuario inactivo"
            });
          }
      
          // Pasar al siguiente middleware si todo es correcto
          next();
      
        } catch (error) {
          return res.status(401).json({
            msg: "Token no válido"
          });
        }
      }
}


export { validate };