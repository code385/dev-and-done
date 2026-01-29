import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as PortfolioModel from '@/lib/mongodb/models/Portfolio';

/**
 * GET /api/admin/portfolio
 * Get all portfolio projects (admin only)
 */
export async function GET(request) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Build filter
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (featured !== null && featured !== undefined) {
      filter.featured = featured === 'true';
    }

    const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;

    const projects = await PortfolioModel.getPortfolioProjects(filter, {
      limit,
      published: publishedFilter,
      sort: { order: -1, createdAt: -1 },
    });

    return NextResponse.json({
      success: true,
      projects: projects.map((project) => ({
        id: project._id.toString(),
        title: project.title,
        slug: project.slug,
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
        published: project.published !== false,
        order: project.order || 0,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
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

/**
 * POST /api/admin/portfolio
 * Create a new portfolio project (admin only)
 */
export async function POST(request) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      problem,
      solution,
      result,
      category,
      client,
      image,
      techStack,
      metrics,
      githubLink,
      liveLink,
      demoVideo,
      featured,
      published,
      order,
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create project data
    const projectData = {
      title,
      description: description || '',
      problem: problem || '',
      solution: solution || '',
      result: result || '',
      category: category || 'Web Development',
      client: client || '',
      image: image || '',
      techStack: Array.isArray(techStack) ? techStack : [],
      metrics: Array.isArray(metrics) ? metrics : [],
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      demoVideo: demoVideo || '',
      featured: featured === true,
      published: published !== false,
      order: order || 0,
    };

    // Create project
    const createResult = await PortfolioModel.createPortfolioProject(projectData);

    return NextResponse.json({
      success: true,
      project: {
        id: createResult.id.toString(),
        ...createResult.project,
        _id: createResult.id.toString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create portfolio project' },
      { status: 500 }
    );
  }
}
