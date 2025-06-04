import * as User from '../models/userModel.js';

const authController = {
  // Google Login Handler
  googleLogin: async (req, res) => {
  const {
    googleId, email, name, picture, role,
    locations,snowRate, lawnRate , services, experience,mobilenumber
  } = req.body;
console.log("Google Login Request:", req.body);
  if (!googleId || !email || !name || !picture || !role) {
    return res.status(400).json({ message: 'Missing required user information' });
  }

  try {
    let user = await User.default.findByGoogleId(googleId);

    if (!user) {
      const status = role === 'provider' ? 'pending' : 'not_applicable';
      user = await User.default.create({
        googleId, email, name, picture, role, status,
        locations, snowRate, lawnRate, services, experience,mobilenumber
      });
    }

    // If user exists and is a provider, you might also want to
    // update their details on every login:
    // else if (role === 'provider') {
    //   user = await User.default.updateProviderDetails(
    //     googleId, locations, snowRate,lawnRate, services, experience,mobilenumber
    //   );
    // }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        googleId: user.google_id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        status: user.status,
        locations: user.locations,
        snowRate: user.snowRate,
        lawnRate: user.lawnRate,
        services: user.services,
        experience: user.experience,
        mobilenumber: user.mobilenumber
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
      status: user.status,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
},
// For Admin: Reject a Provider
rejectProvider: async (req, res) => {
  console.log("Rejecting provider");
  const { userId } = req.params;
  console.log("Rejecting provider with ID:", userId);

  try {
    const rejectedUser = await User.default.rejectProvider(userId);

    if (!rejectedUser) {
      return res.status(404).json({ message: 'Provider not found or already rejected' });
    }

    res.status(200).json({ message: 'Provider rejected', user: rejectedUser });
  } catch (error) {
    console.error('Error rejecting provider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},
// src/controllers/providerController.js
searchProviders :async (req, res) => {
  try {
    const { serviceType, location, minRating } = req.query;

    if (!serviceType) {
      return res.status(400).json({ message: "Service type is required" });
    }
   console.log("Searching providers with parameters:", {
      serviceType, location, minRating
    });
    const providers = await User.default.findProviders({ serviceType, location, minRating });
    res.json(providers);

  } catch (error) {
    console.error('Error searching providers:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}


};


export default authController;
