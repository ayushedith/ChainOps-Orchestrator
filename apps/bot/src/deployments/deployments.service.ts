import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DeploymentSummary {
  id: string;
  project: string;
  pipeline?: string | null;
  status: string;
  commitHash: string;
  startedAt: Date;
  completedAt?: Date | null;
  initiator: string;
}

interface ActiveRunSummary {
  id: string;
  commitHash: string;
  startedAt: Date;
  project: { name: string };
  pipeline: { name: string } | null;
}

interface LatestDeploymentSummary {
  id: string;
  status: string;
  commitHash: string;
  initiator: string;
  startedAt: Date;
  completedAt: Date | null;
  project: { name: string };
  pipeline: { name: string } | null;
}

interface TopProjectSummary {
  id: string;
  name: string;
  slug: string;
  _count: { deployments: number };
}

export interface DeploymentOperationsSnapshot {
  window: number;
  metrics: {
    totalDeployments: number;
    windowDeployments: number;
    successRate: number;
    failedDeployments: number;
  };
  activeRuns: ActiveRunSummary[];
  latestDeployment: LatestDeploymentSummary | null;
  topProjects: TopProjectSummary[];
}

@Injectable()
export class DeploymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findRecent(limit = 10, projectSlug?: string): Promise<DeploymentSummary[]> {
    const where = projectSlug ? { project: { slug: projectSlug } } : undefined;

    const deployments = (await this.prisma.deployment.findMany({
      take: limit,
      orderBy: { startedAt: 'desc' },
      where,
      include: {
        project: { select: { name: true } },
        pipeline: { select: { name: true } }
      }
    })) as Array<{
      id: string;
      project: { name: string };
      pipeline: { name: string } | null;
      status: string;
      commitHash: string;
      startedAt: Date;
      completedAt: Date | null;
      initiator: string;
    }>;

    return deployments.map((deployment) => ({
      id: deployment.id,
      project: deployment.project.name,
      pipeline: deployment.pipeline?.name ?? null,
      status: deployment.status,
      commitHash: deployment.commitHash,
      startedAt: deployment.startedAt,
      completedAt: deployment.completedAt,
      initiator: deployment.initiator
    }));
  }

  async findOne(id: string) {
    return this.prisma.deployment.findUnique({
      where: { id },
      include: {
        project: true,
        pipeline: true,
        events: {
          orderBy: { occurredAt: 'asc' }
        }
      }
    });
  }

  async recordEvent(data: {
    deploymentId: string;
    level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    source: string;
    message: string;
    occurredAt?: Date;
    payload?: unknown;
  }) {
    return this.prisma.deploymentEvent.create({ data: data as any });
  }

  async getOperationsSnapshot(lookbackHours = 24): Promise<DeploymentOperationsSnapshot> {
    const since = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

    const [totalDeployments, windowDeployments, successDeployments, failedDeployments, activeRuns, latestDeployment, topProjects] =
      (await Promise.all([
        this.prisma.deployment.count(),
        this.prisma.deployment.count({ where: { startedAt: { gte: since } } }),
        this.prisma.deployment.count({
          where: {
            startedAt: { gte: since },
            status: 'SUCCESS'
          }
        }),
        this.prisma.deployment.count({
          where: {
            startedAt: { gte: since },
            status: 'FAILED'
          }
        }),
        this.prisma.deployment.findMany({
          where: { status: { in: ['RUNNING', 'PENDING'] } },
          orderBy: { startedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            commitHash: true,
            startedAt: true,
            project: { select: { name: true } },
            pipeline: { select: { name: true } }
          }
        }),
        this.prisma.deployment.findFirst({
          orderBy: { startedAt: 'desc' },
          select: {
            id: true,
            status: true,
            commitHash: true,
            initiator: true,
            startedAt: true,
            completedAt: true,
            project: { select: { name: true } },
            pipeline: { select: { name: true } }
          }
        }),
        this.prisma.project.findMany({
          take: 3,
          orderBy: {
            deployments: {
              _count: 'desc'
            }
          },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: { select: { deployments: true } }
          }
        })
      ])) as [
        number,
        number,
        number,
        number,
        ActiveRunSummary[],
        LatestDeploymentSummary | null,
        TopProjectSummary[]
      ];

    const successRate = windowDeployments === 0 ? 0 : Math.round((successDeployments / windowDeployments) * 100);

    return {
      window: lookbackHours,
      metrics: {
        totalDeployments,
        windowDeployments,
        successRate,
        failedDeployments
      },
      activeRuns,
      latestDeployment,
      topProjects
    };
  }
}
