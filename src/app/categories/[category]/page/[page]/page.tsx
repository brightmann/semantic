import { Pagination } from "@semantic/components/ui/pagination";
import { PostList } from "@semantic/components/ui/post-list";
import { ROUTES } from "@semantic/constants/menu";
import { POST } from "@semantic/constants/metadata";
import { generatePageMetadata } from "@semantic/utils/metadata-util";
import { getAllPosts } from "@semantic/utils/post-util";
import { slugify } from "@semantic/utils/text-util";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoriesPagedPageProps {
  params: Promise<{ category: string; page: string }>;
}

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const categories = [...new Set(allPosts.map((post) => post.category))];

  // Page 1 lives at /categories/[category]; only pages 2..N get their own route.
  // Static export requires at least one param, so fall back to a
  // placeholder page that renders not-found when everything is single-page.
  const pages = categories.flatMap((category) => {
    const categoryPosts = allPosts.filter((post) => post.category === category);
    const totalPages = Math.ceil(categoryPosts.length / POST.PER_PAGE);

    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      category: slugify(category),
      page: (i + 2).toString(),
    }));
  });

  if (pages.length > 0) {
    return pages;
  }

  const [firstCategory] = categories;
  return firstCategory ? [{ category: slugify(firstCategory), page: "2" }] : [];
};

const CategoriesPagedPage = async ({ params }: CategoriesPagedPageProps) => {
  const { category, page } = await params;
  const currentPage = Number.parseInt(page, 10);

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter(
    (post) => slugify(post.category) === category
  );
  const totalPages = Math.ceil(categoryPosts.length / POST.PER_PAGE);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 2 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const sortedPosts = categoryPosts.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  const start = (currentPage - 1) * POST.PER_PAGE;
  const currentPosts = sortedPosts.slice(start, start + POST.PER_PAGE);

  return (
    <>
      <h1 className="h3 mb-[1.875rem] text-[var(--color-gray-light)]">
        {categoryPosts.length > 0
          ? `${categoryPosts[0].category} (${categoryPosts.length})`
          : `${category} (0 posts)`}
      </h1>

      <PostList posts={currentPosts} />

      <Pagination
        basePath={`${ROUTES.CATEGORIES}/${category}`}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default CategoriesPagedPage;

export const generateMetadata = async ({
  params,
}: CategoriesPagedPageProps): Promise<Metadata> => {
  const { category, page } = await params;

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter(
    (post) => slugify(post.category) === category
  );
  const categoryName = categoryPosts[0]?.category ?? category;

  return generatePageMetadata({
    path: `${ROUTES.CATEGORIES}/${category}/page/${page}`,
    title: `${categoryName} - Page ${page}`,
  });
};
