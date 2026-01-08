import { NextResponse } from 'next/server';
import * as TestimonialModel from '@/lib/mongodb/models/Testimonial';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/testimonials - Get all approved testimonials (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter = {
      isApproved: true,
    };

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    if (featured) {
      filter.featured = true;
    }

    const options = {
      page,
      limit,
      sort: featured ? { featured: -1, createdAt: -1 } : { createdAt: -1 },
    };

    const result = await TestimonialModel.getTestimonials(filter, options);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create testimonial (admin only)
export async function POST(request) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, role, company, testimonial, rating, serviceType, image, videoUrl, isApproved, featured } = body;

    // Validation
    if (!name || !testimonial) {
      return NextResponse.json(
        { success: false, error: 'Name and testimonial are required' },
        { status: 400 }
      );
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const result = await TestimonialModel.createTestimonial({
      name,
      role,
      company,
      testimonial,
      rating: rating || 5,
      serviceType: serviceType || 'general',
      image,
      videoUrl,
      isApproved: isApproved !== undefined ? isApproved : false,
      featured: featured !== undefined ? featured : false,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

