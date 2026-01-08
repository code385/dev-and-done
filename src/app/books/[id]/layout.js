import * as BookModel from '@/lib/mongodb/models/Book';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const book = await BookModel.getBookById(id);
    
    if (!book || !book.isPublished) {
      return {
        title: 'Book Not Found | DevAndDone',
        description: 'Book not found',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/books/${id}`;
    const image = book.coverImage 
      ? (book.coverImage.startsWith('http') ? book.coverImage : `${baseUrl}${book.coverImage}`)
      : `${baseUrl}/og-image.jpg`;

    return {
      title: `${book.title} by ${book.author} | DevAndDone Books`,
      description: book.description || `Read ${book.title} by ${book.author} on DevAndDone`,
      keywords: book.category ? [book.category, 'DevAndDone', 'books', book.author] : ['DevAndDone', 'books'],
      authors: [{ name: book.author }],
      openGraph: {
        title: `${book.title} by ${book.author}`,
        description: book.description || `Read ${book.title} by ${book.author}`,
        url: url,
        siteName: 'DevAndDone',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: book.title,
          },
        ],
        locale: 'en_US',
        type: 'book',
        authors: [book.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${book.title} by ${book.author}`,
        description: book.description || `Read ${book.title} by ${book.author}`,
        images: [image],
        creator: '@devanddone',
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    return {
      title: 'Book Details | DevAndDone',
      description: 'Read books and share your thoughts through reviews.',
    };
  }
}

export default function BookDetailLayout({ children }) {
  return children;
}

