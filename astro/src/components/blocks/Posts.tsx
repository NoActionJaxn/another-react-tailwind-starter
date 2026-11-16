'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  GridContainer,
  ListingCard,
  Pagination,
} from '@noactionjaxn/another-react-tailwind-component-library';
import BlockHeading from '@/components/blocks/BlockHeading';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import type { Post } from '@/types/directus-schema';
import { fetchPaginatedPosts } from '@/lib/directus/fetchers';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface PostsProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    posts: Post[];
    limit: number;
    totalPages: number;
  };
}

const Posts = ({ data }: PostsProps) => {
  const { tagline, headline, posts, limit, totalPages, id } = data;
  const perPage = limit || 6;

  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);

      return Number(sp.get('page')) || 1;
    }

    return 1;
  });

  const [paginatedPosts, setPaginatedPosts] = useState<Post[]>(currentPage === 1 ? posts || [] : []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentPage === 1) {
        setPaginatedPosts(posts || []);

        return;
      }

      try {
        const response = await fetchPaginatedPosts(perPage, currentPage);
        setPaginatedPosts(response || []);
      } catch {
        setPaginatedPosts([]);
      }
    };

    fetchPosts();
  }, [currentPage, perPage, posts]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `?page=${page}`);
      }
    }
  };

  const attr = (fields: string | string[]) =>
    setBlockAttr({ blockCollection: 'block_posts', blockItemId: id, fields, mode: 'popover' });

  return (
    <Container asChild>
      <div>
        <BlockHeading
          tagline={tagline}
          headline={headline}
          taglineAttr={attr('tagline')}
          headlineAttr={attr('headline')}
        />

        {paginatedPosts && paginatedPosts.length > 0 ? (
          <GridContainer
            block
            columns={3}
            minColumnWidth="16rem"
            gap="lg"
            className="mt-8 px-0"
            data-directus={attr(['collection', 'limit'])}
          >
            {paginatedPosts.map((post) => (
              <a key={post.id} href={`/blog/${post.slug}`} className="group block h-full no-underline">
                <ListingCard
                  className="h-full transition-shadow group-hover:shadow-lg"
                  title={post.title}
                  subtitle={post.description || undefined}
                  imageSrc={post.image ? getDirectusAssetURL(post.image) : undefined}
                  imageAlt={post.title}
                />
              </a>
            ))}
          </GridContainer>
        ) : (
          <p className="mt-8 text-center opacity-70" data-directus={attr(['collection', 'limit'])}>
            No posts available.
          </p>
        )}

        {totalPages > 1 && (
          <Pagination
            className="mt-10 justify-center"
            page={currentPage}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            showFirstLast
          />
        )}
      </div>
    </Container>
  );
};

export default Posts;
