import { NextResponse } from 'next/server';
import * as PortfolioModel from '@/lib/mongodb/models/Portfolio';

/**
 * GET /api/portfolio
 * Get all published portfolio projects (public)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Build filter
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.featured = true;
    }

    const projects = await PortfolioModel.getPortfolioProjects(filter, {
      limit,
      published: true, // Only published projects
      sort: { order: -1, createdAt: -1 },
    });

    return NextResponse.json({
      success: true,
      projects: projects.map((project) => ({
        id: project._id.toString(),
        slug: project.slug,
        title: project.title,
        description: project.description,
        problem: project.problem,
        solution: project.solution,
        result: project.result,
        category: project.category,
        client: project.client,
        image: project.image,
        techStack: project.techStack || [],
        metrics: project.metrics || [],
        githubLink: project.githubLink || '',
        liveLink: project.liveLink || '',
        demoVideo: project.demoVideo || '',
        featured: project.featured || false,
        createdAt: project.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio projects' },
      { status: 500 }
    );
  }
}
