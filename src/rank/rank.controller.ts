import { Controller, Get, Next, Res } from '@nestjs/common';
import { RankService } from './rank.service';
import { NextFunction, Response } from 'express';

@Controller('ranks')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Get('yearly')
  async getRankYearly(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.rankService.getRankYearly();
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  @Get('monthly')
  async getRankMonthly(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const result = await this.rankService.getRankMonthly();
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
