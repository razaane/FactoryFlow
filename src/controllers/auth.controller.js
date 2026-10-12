const authService = require("../services/auth.service");
async function login(req, res, next) {
     try { 
        const { email, password } = req.body; 
        const result = await authService.login(email, password); 
        return res.status(200).json({ success: true, 
            message: "Connexion réussie", 
            data: result, }); 
        } catch (error) { 
            next(error); 
        } 
} 

function getProfile(req, res) {
    return res.status(200).json({
        success: true,
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    });
}

module.exports = {
    login,
    getProfile,
};