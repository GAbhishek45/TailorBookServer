import User from './../Models/User.js';

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Please fill all the fields"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "User does not exist"
            });
        }

        return res.status(200).json({
            success: true,
            msg: "User logged in successfully",
            user
        });
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        return res.status(500).json({
            success: false,
            msg: "Something went wrong in logging in user"
        });
    }
};

export const registerController = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Please fill all the fields"
            });
        }

        const existingFullName = await User.findOne({ fullName });

        if (existingFullName) {
            return res.status(400).json({
                success: false,
                msg: "User already exists"
            });
        }

        const user = await User.create({
            fullName,
            email,
            password
        });

        res.status(200).json({
            success: true,
            msg: "User registered successfully",
            user
        });

        console.log("Response Sent Successfully ✅"); // ✅ Log this
    } catch (error) {
        console.error(error); // Log actual error for debugging
        return res.status(500).json({
            success: false,
            msg: "Something went wrong in registering user"
        });
    }
};
