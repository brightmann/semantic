import { Pagination } from "@semantic/components/ui/pagination";
import { PostList } from "@semantic/components/ui/post-list";
import { ROUTES } from "@semantic/constants/menu";
import { POST } from "@semantic/constants/metadata";
import { generatePageMetadata } from "@semantic/utils/metadata-util";
import { getAllPosts } from "@semantic/utils/post-util";
import { slugify } from "@semantic/utils/text-util";
import type { Metadata } from "next";

interface TagsPageProps {
  params: Promise<{ tag: string }>;
}

const TagsPage = async ({ params }: TagsPageProps) => {
  const { tag } = await params;

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) =>
    post.tags?.some((t) => slugify(t) === tag)
  );

  const sortedPosts = tagPosts.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  const currentPosts = sortedPosts.slice(0, POST.PER_PAGE);

  const tagName = tagPosts[0]?.tags?.find((t) => slugify(t) === tag) ?? tag;

  return (
    <>
      <h1 className="h3 mb-[1.875rem] text-[var(--color-gray-light)]">
        {tagName} ({tagPosts.length})
      </h1>
      <PostList posts={currentPosts} />
      <Pagination
        basePath={`${ROUTES.TAGS}/${tag}`}
        currentPage={1}
        totalPages={Math.ceil(tagPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default TagsPage;

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const tags = [...new Set(allPosts.flatMap((post) => post.tags || []))];

  return tags.map((tag) => ({
    tag: slugify(tag),
  }));
};

export const generateMetadata = async ({
  params,
}: TagsPageProps): Promise<Metadata> => {
  const { tag } = await params;

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) =>
    post.tags?.some((t) => slugify(t) === tag)
  );

  const tagName = tagPosts[0]?.tags?.find((t) => slugify(t) === tag) ?? tag;

  return generatePageMetadata({
    path: `${ROUTES.TAGS}/${tag}`,
    title: tagName,
  });
};
