


//Middleware to check userId and hasPremiumPlan

import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = req.auth()

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const hasPremiumPlan = await has({ plan: "premium" })
    const user = await clerkClient.users.getUser(userId)

    if (!hasPremiumPlan) {
      req.free_usage = user.privateMetadata.free_usage || 0
      req.plan = "free"
    } else {
      // RESET USAGE
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          free_usage: 0,
        },
        publicMetadata: {
          ...user.publicMetadata,
          plan: "Premium"   // ✅ THIS IS THE MISSING PART
        }
      })

      req.free_usage = 0
      req.plan = "premium"
    }

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}