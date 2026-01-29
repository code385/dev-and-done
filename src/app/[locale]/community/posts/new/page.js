'use client';

import Section from '@/components/ui/Section';
import PostEditor from '@/components/community/PostEditor';
import { CommunityErrorBoundary } from '@/components/community/ErrorBoundary';
import { useTranslations } from 'next-intl';

export default function NewPostPage() {
  const t = useTranslations();

  return (
    <CommunityErrorBoundary>
      <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Create New Post</h1>
            <p className="text-muted-foreground">
              Share your thoughts, ask questions, or showcase your work with the community
            </p>
          </div>

          <PostEditor />
        </div>
      </Section>
    </CommunityErrorBoundary>
  );
}

