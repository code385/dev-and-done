import { notFound } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CategoryFilter from '@/components/ui/CategoryFilter';
import * as CategoryModel from '@/lib/mongodb/models/Category';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as BookModel from '@/lib/mongodb/models/Book';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { category } = await params;
  
  try {
    const categoryData = await CategoryModel.getCategoryBySlug(category);
    
    if (!categoryData) {
      return {
        title: 'Category Not Found',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/categories/${category}`;

    return {
      title: `${categoryData.name} | DevAndDone Blog`,
      description: categoryData.description || `Browse all content in ${categoryData.name} category`,
      keywords: [categoryData.name, 'DevAndDone', 'blog', 'category'],
      openGraph: {
        title: `${categoryData.name} Category`,
        description: categoryData.description || `Browse all content in ${categoryData.name} category`,
        url: url,
        siteName: 'DevAndDone',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: `${categoryData.name} Category`,
        description: categoryData.description || `Browse all content in ${categoryData.name} category`,
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: 'Category Not Found',
    };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const page = parseInt(searchParams?.page || '1');
  const limit = 12;
  
  let categoryData = null;
  let blogs = [];
  let books = [];
  let pagination = { page, limit, total: 0, pages: 0 };
  
  try {
    categoryData = await CategoryModel.getCategoryBySlug(category);
    
    if (!categoryData) {
      notFound();
    }
    
    // Get blogs in this category
    const { ObjectId } = await import('mongodb');
    const categoryId = categoryData._id;
    
    const blogsResult = await BlogModel.getBlogs(
      { 
        isPublished: true,
        category: categoryId
      },
      { 
        page, 
        limit, 
        sort: { createdAt: -1 },
        populate: true
      }
    );
    
    blogs = blogsResult.blogs || [];
    
    // Get books in this category
    const booksResult = await BookModel.getBooks(
      { 
        isPublished: true,
        category: categoryId
      },
      { 
        page, 
        limit, 
        sort: { publishedAt: -1 },
        populate: true
      }
    );
    
    books = booksResult.books || [];
    
    const total = blogs.length + books.length;
    pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error fetching category page:', error);
    notFound();
  }

  const allContent = [...blogs, ...books].sort((a, b) => {
    const dateA = a.createdAt || a.publishedAt || new Date(0);
    const dateB = b.createdAt || b.publishedAt || new Date(0);
    return new Date(dateB) - new Date(dateA);
  });

  return (
    <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div 
            className="inline-block px-4 py-2 rounded-full text-lg font-semibold mb-4"
            style={{ 
              backgroundColor: categoryData.color ? `${categoryData.color}20` : 'var(--primary)20',
              color: categoryData.color || 'var(--primary)'
            }}
          >
            {categoryData.name}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {categoryData.name}
          </h1>
          {categoryData.description && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              {categoryData.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {categoryData.count || 0} {categoryData.count === 1 ? 'item' : 'items'} in this category
          </p>
        </div>

        {/* Content Grid */}
        {allContent.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {allContent.map((item, index) => {
                const isBlog = 'slug' in item;
                const href = isBlog ? `/blogs/${item.slug}` : `/books/${item._id}`;
                const title = item.title;
                const excerpt = item.excerpt || item.description || '';
                const coverImage = item.coverImage;
                
                return (
                  <motion.div
                    key={item._id?.toString() || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card hover>
                      {coverImage && (
                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                          <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2">{title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {excerpt}
                      </p>
                      <Link href={href}>
                        <Button variant="outline" size="sm">
                          {isBlog ? 'Read Article' : 'View Book'}
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {page > 1 && (
                  <Link href={`/categories/${category}?page=${page - 1}`}>
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}
                <span className="flex items-center px-4 text-muted-foreground">
                  Page {page} of {pagination.pages}
                </span>
                {page < pagination.pages && (
                  <Link href={`/categories/${category}?page=${page + 1}`}>
                    <Button variant="outline">Next</Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No content found in this category.
            </p>
            <Link href="/blogs">
              <Button variant="primary">Browse All Blogs</Button>
            </Link>
          </div>
        )}

        {/* Category Filter */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Browse Other Categories</h2>
          <CategoryFilter />
        </div>
      </div>
    </Section>
  );
}


