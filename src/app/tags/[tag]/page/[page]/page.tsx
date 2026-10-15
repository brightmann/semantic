import { Pagination } from "@semantic/components/ui/pagination";
import { PostList } from "@semantic/components/ui/post-list";
import { ROUTES } from "@semantic/constants/menu";
import { POST } from "@semantic/constants/metadata";
import { generatePageMetadata } from "@semantic/utils/metadata-util";
import { getAllPosts } from "@semantic/utils/post-util";
import { slugify } from "@semantic/utils/text-util";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface TagsPagedPageProps {
  params: Promise<{ tag: string; page: string }>;
}

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const tags = [...new Set(allPosts.flatMap((post) => post.tags || []))];

  // Page 1 lives at /tags/[tag]; only pages 2..N get their own route.
  // Static export requires at least one param, so fall back to a
  // placeholder page that renders not-found when everything is single-page.
  const pages = tags.flatMap((tag) => {
    const tagPosts = allPosts.filter((post) => post.tags?.includes(tag));
    const totalPages = Math.ceil(tagPosts.length / POST.PER_PAGE);

    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      page: (i + 2).toString(),
      tag: slugify(tag),
    }));
  });

  if (pages.length > 0) {
    return pages;
  }

  const [firstTag] = tags;
  return firstTag ? [{ page: "2", tag: slugify(firstTag) }] : [];
};

const TagsPagedPage = async ({ params }: TagsPagedPageProps) => {
  const { tag, page } = await params;
  const currentPage = Number.parseInt(page, 10);

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) =>
    post.tags?.some((t) => slugify(t) === tag)
  );
  const totalPages = Math.ceil(tagPosts.length / POST.PER_PAGE);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 2 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const sortedPosts = tagPosts.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  const start = (currentPage - 1) * POST.PER_PAGE;
  const currentPosts = sortedPosts.slice(start, start + POST.PER_PAGE);

  const tagName = tagPosts[0]?.tags?.find((t) => slugify(t) === tag) ?? tag;

  return (
    <>
      <h1 className="h3 mb-[1.875rem] text-[var(--color-gray-light)]">
        {tagName} ({tagPosts.length})
      </h1>
      <PostList posts={currentPosts} />
      <Pagination
        basePath={`${ROUTES.TAGS}/${tag}`}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default TagsPagedPage;

export const generateMetadata = async ({
  params,
}: TagsPagedPageProps): Promise<Metadata> => {
  const { tag, page } = await params;

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) =>
    post.tags?.some((t) => slugify(t) === tag)
  );

  const tagName = tagPosts[0]?.tags?.find((t) => slugify(t) === tag) ?? tag;

  return generatePageMetadata({
    path: `${ROUTES.TAGS}/${tag}/page/${page}`,
    title: `${tagName} - Page ${page}`,
  });
};
