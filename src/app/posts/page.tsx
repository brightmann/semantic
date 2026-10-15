import { Pagination } from "@semantic/components/ui/pagination";
import { PostList } from "@semantic/components/ui/post-list";
import { ROUTES } from "@semantic/constants/menu";
import { POST } from "@semantic/constants/metadata";
import { generatePageMetadata } from "@semantic/utils/metadata-util";
import { getAllPosts } from "@semantic/utils/post-util";
import type { Metadata } from "next";

const PostsPage = async () => {
  const allPosts = await getAllPosts();
  const sortedPosts = [...allPosts].sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1
  );

  const currentPosts = sortedPosts.slice(0, POST.PER_PAGE);

  return (
    <>
      <h1 className="h3 mb-[1.875rem] text-[var(--color-gray-light)]">
        Posts ({allPosts.length})
      </h1>

      <PostList posts={currentPosts} />

      <Pagination
        basePath={ROUTES.POSTS}
        currentPage={1}
        totalPages={Math.ceil(allPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default PostsPage;

export const generateMetadata = async (): Promise<Metadata> =>
  generatePageMetadata({
    path: ROUTES.POSTS,
    title: "Posts",
  });
