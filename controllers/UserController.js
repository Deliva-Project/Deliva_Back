const User = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("../authorization/jwt");
const Resend = require("resend");

const resend = new Resend.Resend(process.env.RESEND_KEY);

const register = async (req, res) => {
    let userBody = req.body;

    if (!userBody.name || !userBody.lastName || !userBody.email || !userBody.username || !userBody.password) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let userData = {
        name: userBody.name,
        lastName: userBody.lastName,
        email: userBody.email,
        username: userBody.username,
        password: userBody.password
    }

    try {
        const userAlreadyExist = await User.find({ $or: [{ username: userData.username }, { email: userData.email }] });

        if (userAlreadyExist.length >= 1) {
            return res.status(400).json({
                "status": "error",
                "message": "El usuario ya existe"
            });
        }

        let pwd = await bcrypt.hash(userData.password, 10);
        userData.password = pwd;

        let user_to_save = new User(userData);

        try {
            const userStored = await user_to_save.save();

            if (!userStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No user saved"
                });
            }

            return res.status(200).json({
                "userId": userStored._id
            });

        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving user"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user duplicate"
        });
    }
}

const loginUser = (req, res) => {
    let userBody = req.body;

    if (!userBody.username || !userBody.password) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    User.findOne({ username: userBody.username }).then(user => {
        if (!user) {
            return res.status(400).json({
                "status": "error",
                "message": "Usuario no existe"
            });
        }

        let pwd = bcrypt.compareSync(userBody.password, user.password);

        if (!pwd) {
            return res.status(400).json({
                "status": "error",
                "message": "Contraseña incorrecta"
            });
        }

        const token = jwt.createToken(user);

        return res.status(200).json({
            token,
            "role": user.role
        });

    }).catch(() => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user"
        });
    });
}

const profile = (req, res) => {
    User.findById(req.user.id).select({ password: 0 }).then(user => {
        if (!user) {
            return res.status(404).json({
                "status": "error",
                "message": "User doesn't exist"
            });
        }

        return res.status(200).json({
            user
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding user"
        });
    });
}

const sendVerificationCode = async (req, res) => {
    let userBody = req.body;

    if (!userBody.email) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    try {
        const user = await User.findOne({ email: userBody.email });

        if (!user) {
            return res.status(400).json({
                "status": "error",
                "message": "No existe usuario con ese código registrado"
            });
        }

        let code = Math.floor(100000 + Math.random() * 900000);
        let emailTemplate = "<p>Hola,</p>" + 
        "<p>Alguien ha solicitado una nueva contraseña para la cuenta asociada a este correo.</p>" + 
        "<p>No se ha hecho ningun cambio aún.</p>" + 
        "<p>Si haz sido tú, ingresa este código de verificación en la aplicación:</p>" + 
        "<p>" + code + "</p>" + 
        "<br><br><br>" + 
        "<p>Este correo se encuentra desatendido.<p/>" + 
        "<p>Saludos desde el equipo de seguridad de Piatto.</p>";

        const { error } = await resend.emails.send({
            from: "forget-password-piatto@socialsynergy.pe",
            to: user.email,
            subject: "Código de verificación",
            html: emailTemplate
        });
        
        if (error) {
            return res.status(400).json({
                error
            });
        }

        User.findOneAndUpdate({ _id: user._id }, { verificationCode: code }, { new: true }).then(userUpdated => {
            if (!userUpdated) {
                return res.status(404).json({
                    "mensaje": "User not found"
                });
            }

            return res.status(200).json({
                "id": userUpdated._id
            });
        }).catch(() => {
            return res.status(404).json({
                "mensaje": "Error while finding and updating user"
            });
        });
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user"
        });
    }
}

const verifyCode = (req, res) => {
    let userBody = req.body;

    if (!userBody.verificationCode) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    User.findOne({ "_id": userBody.userId, "verificationCode": userBody.verificationCode }).then(user => {
        if (!user) {
            return res.status(404).json({
                "status": "error",
                "message": "Código incorrecto"
            });
        }

        return res.status(200).json({
            "status": "success"
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding user"
        });
    });
}

const updatePassword = async (req, res) => {
    let userBody = req.body;
    let userId = req.query.userId;

    if (!userBody.password) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let pwd = await bcrypt.hash(userBody.password, 10);

    User.findOneAndUpdate({ _id: userId }, { password: pwd }, { new: true }).then(userUpdated => {
        if (!userUpdated) {
            return res.status(404).json({
                "mensaje": "User not found"
            });
        }
        return res.status(200).send({
            "message": "success"
        });
    }).catch(() => {
        return res.status(404).json({
            "mensaje": "Error while finding and updating user"
        });
    });
}

module.exports = {
    register,
    loginUser,
    profile,
    sendVerificationCode,
    verifyCode,
    updatePassword
}