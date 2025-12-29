/**
 * Emergency Request Controller
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { emergencyRequestService } from '../services/EmergencyRequestService';
import { asyncHandler } from '../utils/errors/errorHandler';

export class EmergencyRequestController {
  /**
   * Create emergency request
   */
  public createEmergencyRequest = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      const request = await emergencyRequestService.createEmergencyRequest({
        customerId: req.user!.userId,
        caregiverId: req.body.caregiverId,
        address: req.body.address,
        notes: req.body.notes,
        phone: req.body.phone,
      });

      res.status(201).json({
        success: true,
        data: request,
        message: 'Emergency request created and notifications sent',
      });
    }
  );

  /**
   * Get emergency requests (for admins and caregivers)
   */
  public getEmergencyRequests = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await emergencyRequestService.getEmergencyRequests(page, limit);

      res.status(200).json({
        success: true,
        ...result,
      });
    }
  );
}

export const emergencyRequestController = new EmergencyRequestController();

