import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/verify';
import * as PortfolioModel from '@/lib/mongodb/models/Portfolio';

/**
 * GET /api/admin/portfolio/[id]
 * Get a single portfolio project (admin only)
 */
export async function GET(request, { params }) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const project = await PortfolioModel.getPortfolioProjectById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project: {
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
      },
    });
  } catch (error) {
    console.error('Error fetching portfolio project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/portfolio/[id]
 * Update a portfolio project (admin only)
 */
export async function PUT(request, { params }) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
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

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (problem !== undefined) updateData.problem = problem;
    if (solution !== undefined) updateData.solution = solution;
    if (result !== undefined) updateData.result = result;
    if (category !== undefined) updateData.category = category;
    if (client !== undefined) updateData.client = client;
    if (image !== undefined) updateData.image = image;
    if (techStack !== undefined) updateData.techStack = Array.isArray(techStack) ? techStack : [];
    if (metrics !== undefined) updateData.metrics = Array.isArray(metrics) ? metrics : [];
    if (githubLink !== undefined) updateData.githubLink = githubLink || '';
    if (liveLink !== undefined) updateData.liveLink = liveLink || '';
    if (demoVideo !== undefined) updateData.demoVideo = demoVideo || '';
    if (featured !== undefined) updateData.featured = featured === true;
    if (published !== undefined) updateData.published = published !== false;
    if (order !== undefined) updateData.order = order || 0;

    const updateResult = await PortfolioModel.updatePortfolioProject(id, updateData);

    if (!updateResult.success) {
      return NextResponse.json(
        { success: false, error: 'Project not found or no changes made' },
        { status: 404 }
      );
    }

    // Fetch updated project
    const updatedProject = await PortfolioModel.getPortfolioProjectById(id);

    return NextResponse.json({
      success: true,
      project: {
        id: updatedProject._id.toString(),
        title: updatedProject.title,
        slug: updatedProject.slug,
        description: updatedProject.description,
        problem: updatedProject.problem,
        solution: updatedProject.solution,
        result: updatedProject.result,
        category: updatedProject.category,
        client: updatedProject.client,
        image: updatedProject.image,
        techStack: updatedProject.techStack || [],
        metrics: updatedProject.metrics || [],
        githubLink: updatedProject.githubLink || '',
        liveLink: updatedProject.liveLink || '',
        demoVideo: updatedProject.demoVideo || '',
        featured: updatedProject.featured || false,
        published: updatedProject.published !== false,
        order: updatedProject.order || 0,
        createdAt: updatedProject.createdAt,
        updatedAt: updatedProject.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating portfolio project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update portfolio project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/portfolio/[id]
 * Delete a portfolio project (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    // Verify admin authentication
    const payload = await verifyToken();
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'founder')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const result = await PortfolioModel.deletePortfolioProject(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting portfolio project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete portfolio project' },
      { status: 500 }
    );
  }
}
