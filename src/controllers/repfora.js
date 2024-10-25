import axios from "axios";
import 'dotenv/config'

const REPFORA = process.env.REPFORA

const ControllerRepfora ={

login: async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const response = await axios.post(`${REPFORA}/api/users/login`, { email, password, role });
        const token = response.data.token;
        console.log('Token recibido',token);
        res.json({token});
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
},

loginInstructor: async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await axios.post(`${REPFORA}/api/instructors/login`, { email, password});
        const token = response.data.token;
        console.log('Token recibido',token);
        res.json({token});
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
},


listallinstructors: async (req, res) => {
    const token = req.headers['token'];
    console.log(token);
    try {
        const response = await axios.get(`${REPFORA}/api/instructors`, { headers: { token: token } });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
},

listinstructorbyid: async (req, res) => {   
    const token = req.headers['token'];
    console.log(token);
    const { id } = req.params;
    try {
        const response = await axios.get(`${REPFORA}/api/instructors/${id}`, { headers: { token: token } });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
},

listafiches: async (req, res) => {
    const token = req.headers['token'];
    console.log(token);
    try {
        const response = await axios.get(`${REPFORA}/api/fiches`, { headers: { token: token } });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
},

listfichesbyid: async (req, res) => {   
    const token = req.headers['token'];
    console.log(token);
    const { id } = req.params;
    try {
        const response = await axios.get(`${REPFORA}/api/fiches/${id}`, { headers: { token: token } });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
},

}

export default ControllerRepfora