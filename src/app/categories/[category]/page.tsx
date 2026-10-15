import { Pagination } from "@semantic/components/ui/pagination";
import { PostList } from "@semantic/components/ui/post-list";
import { ROUTES } from "@semantic/constants/menu";
import { POST } from "@semantic/constants/metadata";
import { generatePageMetadata } from "@semantic/utils/metadata-util";
import { getAllPosts } from "@semantic/utils/post-util";
import { slugify } from "@semantic/utils/text-util";
import type { Metadata } from "next";

interface CategoriesPageProps {
  params: Promise<{ category: string }>;
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { category } = await params;

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter(
    (post) => slugify(post.category) === category
  );

  const sortedPosts = categoryPosts.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  const currentPosts = sortedPosts.slice(0, POST.PER_PAGE);

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
        currentPage={1}
        totalPages={Math.ceil(categoryPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default CategoriesPage;

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const categories = [...new Set(allPosts.map((post) => post.category))];

  return categories.map((category) => ({
    category: slugify(category),
  }));
};

export const generateMetadata = async ({
  params,
}: CategoriesPageProps): Promise<Metadata> => {
  const { category } = await params;

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter(
    (post) => slugify(post.category) === category
  );
  const categoryName = categoryPosts[0]?.category ?? category;

  return generatePageMetadata({
    path: `${ROUTES.CATEGORIES}/${category}`,
    title: categoryName,
  });
};
