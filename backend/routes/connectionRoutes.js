import express from 'express';
import {
  sendConnectionRequest,
  getDistributorRequests,
  getRetailerRequests,
  respondToConnectionRequest,
  getConnectedDistributors,
  getConnectedRetailers,
  searchDistributors,
  removeConnection,
  getSuggestedDistributors,
  getSuggestedRetailers,
  searchRetailers
} from '../controllers/connectionController.js';

import {
  authenticate as authenticateRetailer,
  authorize as authorizeRetailer
} from '../middleware/retailerMiddleware.js';

import {
  authenticate as authenticateDistributor,
  authorize as authorizeDistributor
} from '../middleware/distributorMiddleware.js';

const router = express.Router();

// Retailer routes
router.post('/request', authenticateRetailer, sendConnectionRequest);
router.get('/retailer/requests', authenticateRetailer, authorizeRetailer, getRetailerRequests);
router.get('/retailer/distributors', authenticateRetailer, getConnectedDistributors);
router.get('/search/distributors', authenticateRetailer, authorizeRetailer, searchDistributors);
router.delete('/remove/:distributorId', authenticateRetailer, authorizeRetailer, removeConnection);
router.get('/suggestions', authenticateRetailer, getSuggestedDistributors);

// Distributor routes
router.get('/distributor/requests', authenticateDistributor, getDistributorRequests);
router.get('/distributor/retailers', authenticateDistributor,  getConnectedRetailers);
router.put('/respond/:requestId', authenticateDistributor, respondToConnectionRequest);
router.get('/search/retailers', authenticateDistributor, searchDistributors);
router.get('/suggest/retailers', authenticateDistributor, getSuggestedRetailers);

export default router;