import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { generatePageMetadata } from '@/lib/seo';
import { CommunityErrorBoundary } from '@/components/community/ErrorBoundary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Community Users | DevAndDone',
    description: 'Browse all community members and top contributors',
    path: '/community/users',
  });
}

export default async function UsersPage() {
  const result = await UserModel.getCommunityUsers(
    { isBanned: false },
    {
      page: 1,
      limit: 50,
      sort: { reputation: -1, joinedAt: -1 },
    }
  );

  const users = result.users || [];

  return (
    <CommunityErrorBoundary>
      <Section className="pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Community Members</h1>
          <p className="text-muted-foreground">
            Discover active contributors and top community members
          </p>
        </div>

        {users.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">No members yet</h3>
            <p className="text-muted-foreground">
              Be the first to join the community!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => {
              const getReputationBadge = (reputation) => {
                if (reputation >= 1000) return '🥇';
                if (reputation >= 500) return '🥈';
                if (reputation >= 100) return '🥉';
                return '⭐';
              };

              return (
                <Link key={user._id.toString()} href={`/community/users/${user.username}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                        {user.displayName?.[0]?.toUpperCase() || user.username[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{user.displayName || user.username}</h3>
                          <span className="text-xl">{getReputationBadge(user.reputation || 0)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{user.bio}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        <span className="text-primary font-semibold">{user.reputation || 0}</span>
                        <span className="text-muted-foreground">reputation</span>
                      </div>
                      <div className="text-muted-foreground">
                        {user.postCount || 0} posts
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Section>
    </CommunityErrorBoundary>
  );
}

