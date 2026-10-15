import { Pagination } from "@semantic/components/ui/pagination";
import { PostList } from "@semantic/components/ui/post-list";
import { ROUTES } from "@semantic/constants/menu";
import { POST } from "@semantic/constants/metadata";
import { generatePageMetadata } from "@semantic/utils/metadata-util";
import { getAllPosts } from "@semantic/utils/post-util";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PostsPagedPageProps {
  params: Promise<{ page: string }>;
}

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POST.PER_PAGE);

  // Page 1 lives at /posts; only pages 2..N get their own route.
  // Static export requires at least one param, so fall back to a
  // placeholder page that renders not-found when there's a single page.
  const pages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: (i + 2).toString(),
  }));

  return pages.length > 0 ? pages : [{ page: "2" }];
};

const PostsPagedPage = async ({ params }: PostsPagedPageProps) => {
  const { page } = await params;
  const currentPage = Number.parseInt(page, 10);

  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POST.PER_PAGE);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 2 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const sortedPosts = [...allPosts].sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  const start = (currentPage - 1) * POST.PER_PAGE;
  const currentPosts = sortedPosts.slice(start, start + POST.PER_PAGE);

  return (
    <>
      <h1 className="h3 mb-[1.875rem] text-[var(--color-gray-light)]">
        Posts ({allPosts.length})
      </h1>

      <PostList posts={currentPosts} />

      <Pagination
        basePath={ROUTES.POSTS}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default PostsPagedPage;

export const generateMetadata = async ({
  params,
}: PostsPagedPageProps): Promise<Metadata> => {
  const { page } = await params;

  return generatePageMetadata({
    path: `${ROUTES.POSTS}/page/${page}`,
    title: `Posts - Page ${page}`,
  });
};
