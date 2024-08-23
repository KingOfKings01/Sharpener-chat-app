import User from "../models/User.js";

// Create a new User
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const data = {
      username,
      email,
      password,
    };

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      //todo: hook will be called when user is created from encrypting password.
      const user = await User.create(data);

      const token = User.generateToken({
        id: user.id,
        username: user.username,
      });
      res.status(200).json({ token });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const token = User.generateToken({ id: user.id, username: user.username });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
