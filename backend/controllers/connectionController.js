import ConnectionRequest from '../models/ConnectionRequest.js';
import Retailer from '../models/Retailer.js';
import Distributor from '../models/Distributor.js';
import mongoose from 'mongoose';

// @desc    Send connection request from retailer to distributor
// @route   POST /api/connections/request
// @access  Private (Retailer)
export const sendConnectionRequest = async (req, res) => {
  try {
    const { distributorId, message } = req.body;
    const retailerId = req.user.id; // Assuming user is authenticated

    // Check if distributor exists
    const distributor = await Distributor.findById(distributorId);
    if (!distributor) {
      return res.status(404).json({ message: 'Distributor not found' });
    }

    // Check if connection already exists
    const existingConnection = await ConnectionRequest.findOne({
      retailer: retailerId,
      distributor: distributorId
    });

    if (existingConnection) {
      return res.status(400).json({ 
        message: 'Connection request already exists',
        status: existingConnection.status
      });
    }

    // Check if already connected
    const retailer = await Retailer.findById(retailerId);
    if (retailer.distributors.includes(distributorId)) {
      return res.status(400).json({ message: 'Already connected to this distributor' });
    }

    const connectionRequest = new ConnectionRequest({
      retailer: retailerId,
      distributor: distributorId,
      requestedBy: 'retailer',
      message: message || ''
    });

    await connectionRequest.save();

    // Populate the request with retailer and distributor details
    await connectionRequest.populate([
      { path: 'retailer', select: 'businessName ownerName email phone location' },
      { path: 'distributor', select: 'companyName ownerName email phone location' }
    ]);

    res.status(201).json({
      message: 'Connection request sent successfully',
      connectionRequest
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all connection requests for a distributor
// @route   GET /api/connections/distributor/requests
// @access  Private (Distributor)
export const getDistributorRequests = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const { status } = req.query;

    let filter = { distributor: distributorId };
    if (status) {
      filter.status = status;
    }

    const requests = await ConnectionRequest.find(filter)
      .populate('retailer', 'businessName ownerName email phone location businessType')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Connection requests retrieved successfully',
      requests
    });
  } catch (error) {
    console.error('Error getting distributor requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all connection requests for a retailer
// @route   GET /api/connections/retailer/requests
// @access  Private (Retailer)
export const getRetailerRequests = async (req, res) => {
  try {
    const retailerId = req.user.id;
    const { status } = req.query;

    let filter = { retailer: retailerId };
    if (status) {
      filter.status = status;
    }

    const requests = await ConnectionRequest.find(filter)
      .populate('distributor', 'companyName ownerName email phone location businessType')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Connection requests retrieved successfully',
      requests
    });
  } catch (error) {
    console.error('Error getting retailer requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve or reject connection request
// @route   PUT /api/connections/respond/:requestId
// @access  Private (Distributor)
export const respondToConnectionRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;
    const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'
    const distributorId = req.user.id;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      distributor: distributorId,
      status: 'pending'
    }).session(session);

    if (!connectionRequest) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Connection request not found or already processed' });
    }

    if (action === 'approve') {
      // Update connection request status
      connectionRequest.status = 'approved';
      await connectionRequest.save({ session });

      // Add distributor to retailer's distributors array
      await Retailer.findByIdAndUpdate(
        connectionRequest.retailer,
        { $addToSet: { distributors: distributorId } },
        { session }
      );

      // Add retailer to distributor's retailers array
      await Distributor.findByIdAndUpdate(
        distributorId,
        { $addToSet: { retailers: connectionRequest.retailer } },
        { session }
      );

      await session.commitTransaction();

      await connectionRequest.populate([
        { path: 'retailer', select: 'businessName ownerName email phone' },
        { path: 'distributor', select: 'companyName ownerName email phone' }
      ]);

      res.json({
        message: 'Connection request approved successfully',
        connectionRequest
      });
    } else {
      // Reject the request
      connectionRequest.status = 'rejected';
      connectionRequest.rejectionReason = rejectionReason || '';
      await connectionRequest.save({ session });

      await session.commitTransaction();

      res.json({
        message: 'Connection request rejected',
        connectionRequest
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error('Error responding to connection request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get connected distributors for a retailer
// @route   GET /api/connections/retailer/distributors
// @access  Private (Retailer)
export const getConnectedDistributors = async (req, res) => {
  try {
    const retailerId = req.user.id;

    const retailer = await Retailer.findById(retailerId)
      .populate('distributors', 'companyName ownerName email phone location businessType address')
      .select('distributors');

    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    res.json({
      message: 'Connected distributors retrieved successfully',
      distributors: retailer.distributors
    });
  } catch (error) {
    console.error('Error getting connected distributors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get connected retailers for a distributor
// @route   GET /api/connections/distributor/retailers
// @access  Private (Distributor)
export const getConnectedRetailers = async (req, res) => {
  try {
    const distributorId = req.user.id;

    const distributor = await Distributor.findById(distributorId)
      .populate('retailers', 'businessName ownerName email phone location businessType')
      .select('retailers');

    if (!distributor) {
      return res.status(404).json({ message: 'Distributor not found' });
    }

    res.json({
      message: 'Connected retailers retrieved successfully',
      retailers: distributor.retailers
    });
  } catch (error) {
    console.error('Error getting connected retailers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSuggestedDistributors = async (req, res) => {
  try {
    const { pincode, businessType } = req.query;
    const retailerId = req.user.id;

    // Find all distributors matching criteria
    const query = {};
    if (pincode && businessType) {
      query.$or = [{ pincode }, { businessType }];
    } else if (pincode) {
      query.pincode = pincode;
    } else if (businessType) {
      query.businessType = businessType;
    } else {
      return res.json({ distributors: [] });
    }
    const distributors = await Distributor.find(query).lean();

    // Find all connection requests sent by this retailer
    const requests = await ConnectionRequest.find({
      retailer: retailerId,
      distributor: { $in: distributors.map(d => d._id) }
    }).select('distributor status').lean();

    // Map distributorId to request status
    const requestMap = {};
    requests.forEach(r => {
      requestMap[r.distributor.toString()] = r.status;
    });

    // Attach request status to each distributor
    const distributorsWithStatus = distributors.map(d => ({
      ...d,
      requestStatus: requestMap[d._id.toString()] || null
    }));

    // Sort: those with no requestStatus first
    distributorsWithStatus.sort((a, b) => {
      if (!a.requestStatus && b.requestStatus) return -1;
      if (a.requestStatus && !b.requestStatus) return 1;
      return 0;
    });

    res.json({ distributors: distributorsWithStatus });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Search distributors by location/business type
// @route   GET /api/connections/search/distributors
export const searchDistributors = async (req, res) => {
  try {
    const { location, businessType, companyName, pincode } = req.query;
    const retailerId = req.user.id;

    // Get retailer's already connected distributors
    const retailer = await Retailer.findById(retailerId).select('distributors');
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }
    // Get IDs of distributors already connected to this retailer
    if (!retailer.distributors || !Array.isArray(retailer.distributors)) {
      return res.status(400).json({ message: 'Invalid retailer data' });
    }
    // Ensure distributors is an array of IDs
    if (retailer.distributors.length === 0) {
      return res.json({
        message: 'No distributors found',
        distributors: [],
        count: 0
      });
    }
    const connectedDistributorIds = retailer.distributors || [];

    // Create OR conditions dynamically
    const orConditions = [];
    if (location) {
      orConditions.push({ location: { $regex: location, $options: 'i' } });
    }
    if (businessType) {
      orConditions.push({ businessType: { $regex: businessType, $options: 'i' } });
    }
    if (companyName) {
      orConditions.push({ companyName: { $regex: companyName, $options: 'i' } });
    }
    if (pincode) {
      orConditions.push({ pincode });
    }

    // Final filter with AND: not already connected AND (any one matches)
    const filter = {
      _id: { $nin: connectedDistributorIds },
      ...(orConditions.length > 0 && { $or: orConditions })
    };

    const distributors = await Distributor.find(filter)
      .select('companyName ownerName email phone location businessType address pincode')
      .limit(20);

    res.json({
      message: 'Distributors found',
      distributors,
      count: distributors.length
    });
  } catch (error) {
    console.error('Error searching distributors:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Remove connection between retailer and distributor
// @route   DELETE /api/connections/remove/:distributorId
// @access  Private (Retailer)
export const removeConnection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { distributorId } = req.params;
    const retailerId = req.user.id;

    // Remove distributor from retailer's distributors array
    await Retailer.findByIdAndUpdate(
      retailerId,
      { $pull: { distributors: distributorId } },
      { session }
    );

    // Remove retailer from distributor's retailers array
    await Distributor.findByIdAndUpdate(
      distributorId,
      { $pull: { retailers: retailerId } },
      { session }
    );

    // Update connection request status if exists
    await ConnectionRequest.findOneAndUpdate(
      { retailer: retailerId, distributor: distributorId },
      { status: 'rejected', rejectionReason: 'Connection removed by retailer' },
      { session }
    );

    await session.commitTransaction();

    res.json({
      message: 'Connection removed successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error removing connection:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Suggest retailers to distributor based on pincode or businessType
// @route   GET /api/connections/suggest/retailers
// @access  Private (Distributor)
export const getSuggestedRetailers = async (req, res) => {
  try {
    const distributorId = req.user.id;
    const distributor = await Distributor.findById(distributorId);
    if (!distributor) {
      return res.status(404).json({ message: 'Distributor not found' });
    }

    // Find retailers with same pincode or businessType, not already connected
    const alreadyConnected = distributor.retailers || [];
    const query = {
      _id: { $nin: alreadyConnected },
      $or: [
        { pincode: distributor.pincode },
        { businessType: distributor.businessType }
      ]
    };

    const retailers = await Retailer.find(query)
      .select('businessName ownerName email phone location businessType pincode')
      .limit(20);

    res.json({ retailers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const searchRetailers = async (req, res) => {
  try {
    const { location, businessType, businessName, pincode } = req.query;
    const distributorId = req.user.id;

    // Get distributor's already connected retailers
    const distributor = await Distributor.findById(distributorId).select('retailers');
    if (!distributor) {
      return res.status(404).json({ message: 'Distributor not found' });
    }
    // Get IDs of retailers already connected to this distributor
    if (!distributor.retailers || !Array.isArray(distributor.retailers)) {
      return res.status(400).json({ message: 'Invalid distributor data' });
    }
    // Ensure retailers is an array of IDs
    if (distributor.retailers.length === 0) {
      return res.json({
        message: 'No retailers found',
        retailers: [],
        count: 0
      });
    }
    const connectedRetailerIds = distributor.retailers || [];
    // Create OR conditions dynamically
    const orConditions = [];
    if (location) {
      orConditions.push({ location: { $regex: location, $options: 'i' } });
    }
    if (businessType) {
      orConditions.push({ businessType: { $regex: businessType, $options: 'i' } });
    }
    if (businessName) {
      orConditions.push({ businessName: { $regex: businessName, $options: 'i' } });
    }
    if (pincode) {
      orConditions.push({ pincode });
    }
    const retailers = await Retailer.find({
      _id: { $nin: connectedRetailerIds },
      $or: orConditions
    }).select('businessName ownerName email phone location businessType pincode');

    res.json({
      message: 'Retailers found',
      retailers,
      count: retailers.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};