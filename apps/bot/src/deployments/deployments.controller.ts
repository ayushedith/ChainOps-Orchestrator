import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DeploymentsService } from './deployments.service';

@Controller('deployments')
export class DeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Get('recent')
  findRecent(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.deploymentsService.findRecent(limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deploymentsService.findOne(id);
  }
}
