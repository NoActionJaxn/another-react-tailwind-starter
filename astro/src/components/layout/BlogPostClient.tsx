'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  Container,
  Image,
  Separator,
  Typography,
} from '@noactionjaxn/another-react-tailwind-component-library';
import BaseText from '@/components/ui/Text';
import ShareDialog from '@/components/ui/ShareDialog';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import type { Post, Author } from '@/types/directus-schema';
import { setAttr } from '@/lib/directus/visualEditing';
import { useVisualEditing } from '@/hooks/useVisualEditing';

interface BlogPostClientProps {
  initialPost: Post;
  relatedPosts: Post[];
  author?: Author | null;
  authorName: string;
  postUrl: string;
  slug?: string;
}

export default function BlogPostClient({
  initialPost,
  relatedPosts,
  author,
  authorName,
  postUrl,
  slug,
}: BlogPostClientProps) {
  const { isVisualEditingEnabled, apply } = useVisualEditing();

  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPreviewEnabled(params.get('preview') === 'true');
  }, []);

  const shouldFetchLive = (isVisualEditingEnabled || isPreviewEnabled) && slug;

  const swrKey = shouldFetchLive
    ? `/api/blog-post/${encodeURIComponent(slug!)}?${new URLSearchParams(window.location.search).toString()}&visual-editing=${isVisualEditingEnabled}`
    : null;

  const { data: swrData, mutate } = useSWR(
    swrKey,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch post');
      }
      const data = await res.json();

      return data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const post = shouldFetchLive ? (swrData?.post ?? initialPost) : initialPost;

  useEffect(() => {
    if (isVisualEditingEnabled) {
      apply({
        onSaved: () => {
          mutate();
        },
      });
    }
  }, [isVisualEditingEnabled, apply, mutate]);

  if (!post) return null;

  const attr = (fields: string | string[], mode: 'popover' | 'modal' | 'drawer' = 'popover') =>
    setAttr({ collection: 'posts', item: post.id, fields, mode });

  return (
    <Container className="py-12">
      {post.image && (
        <Image
          src={getDirectusAssetURL(post.image)}
          alt={post.title || 'Post header image'}
          fit="cover"
          className="mb-8 h-[400px] w-full"
          data-directus={attr(['image', 'meta_header_image'], 'modal')}
        />
      )}

      <Typography asChild size="xxl" className="mb-4 font-semibold tracking-tight">
        <h1 data-directus={attr(['title', 'slug'])}>{post.title}</h1>
      </Typography>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,_2fr)_400px]">
        <main className="text-left">
          <BaseText content={post.content || ''} data-directus={attr(['content', 'meta_header_content'], 'drawer')} />
        </main>

        <Card variant="soft" className="h-fit max-w-[496px] space-y-6 p-6">
          {author && (
            <div className="flex items-center gap-4" data-directus={attr(['author'])}>
              <Avatar>
                {author.avatar && <AvatarImage src={getDirectusAssetURL(author.avatar)} alt={authorName || ''} />}
                <AvatarFallback>{authorName?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
              {authorName && <p className="font-bold">{authorName}</p>}
            </div>
          )}

          {post.description && <p data-directus={attr('description')}>{post.description}</p>}

          <ShareDialog postUrl={postUrl} postTitle={post.title} />

          {relatedPosts.length > 0 && (
            <div>
              <Separator className="my-4" />
              <h2 className="mb-4 font-bold">Related Posts</h2>
              <ul className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <li key={relatedPost.id}>
                    <a href={`/blog/${relatedPost.slug}`} className="group flex items-center gap-4">
                      {relatedPost.image && (
                        <Image
                          src={getDirectusAssetURL(relatedPost.image)}
                          alt=""
                          fit="cover"
                          zoomOnHover
                          className="h-[100px] w-[150px] shrink-0"
                        />
                      )}
                      <span className="font-medium group-hover:underline">{relatedPost.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}
