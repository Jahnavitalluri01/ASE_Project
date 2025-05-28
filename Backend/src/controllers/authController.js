import * as User from '../models/userModel.js';

const authController = {
  // Google Login Handler
  googleLogin: async (req, res) => {
    const { googleId, email, name, picture, role } = req.body;

    if (!googleId || !email || !name || !picture || !role) {
      return res.status(400).json({ message: 'Missing required user information' });
    }
    console.log("role"+ role);

    try {
      let user = await User.default.findByGoogleId(googleId);

      if (!user) {
        // console.log("User not found:", user);
        const is_approved = role === 'provider' ? false : true;
        user = await User.create({ googleId, email, name, picture, role, is_approved });
      }

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          googleId: user.google_id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
          is_approved: user.is_approved,
        },
      });
    } catch (error) {
      console.error('Error during Google login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // For Admin: Get All Pending Providers
  getallPendingProviders: async (req, res) => {
    console.log(User)
    try {
      const providers = await User.default.getPendingProviders();
      res.status(200).json(providers);
    } catch (error) {
      console.error('Error fetching pending providers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // For Admin: Approve a Provider
  approveProvider: async (req, res) => {
    const { userId } = req.params;
        console.log("Approving provider with ID:", userId);
    try {
      const approvedUser = await User.default.approveProvider(userId);

      if (!approvedUser) {
        return res.status(404).json({ message: 'Provider not found or already approved' });
      }

      res.status(200).json({ message: 'Provider approved', user: approvedUser });
    } catch (error) {
      console.error('Error approving provider:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // In authController.js
getUserDetails: async (req, res) => {
  const { id, email } = req.query
console.log("Fetching user details with ID:", id, "and Email:", email);
  if (!id && !email) {
    console.log("Inside")
    return res.status(400).json({ message: "User ID or Email is required" });
  }

  try {
    const user = id
      ? await User.default.findById(id)
      : await User.default.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      googleId: user.google_id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
      is_approved: user.is_approved,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
},

};


export default authController;
