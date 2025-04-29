"use client";

import { getPosts } from "@/app/actions/posts";
// import { useEffect, useState } from "react";
import Singlepost from "./Singlepost";
import { Post } from "../helpers/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import PostSkeleton from "./skeletons/PostSkeleton";

const AllPosts = () => {
  // const [posts, setPosts] = useState<Post[]>([]);

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <div className="px-3 md:px-3 py-2 mb-5">
      <section>
        <div className="mt-4 flex flex-col md:flex-row justify-center items-center gap-2">
          <h2 className="text-3xl font-medium text-center">
            Moments Captured in camera
          </h2>
          <Image src="/logo.png" width={30} height={30} alt="camera" />
        </div>

        <div className="mt-5 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </>
          ) : (
            posts.map((post, idx) => <Singlepost key={idx} post={post} />)
          )}
        </div>

        {!isLoading && posts.length === 0 && (
          <>
            <div className="flex flex-col items-center gap-2 text-lg">
              <p className="text-gray-400">No posts created yet!</p>
              <Image src="/pic.png" alt="home-logo" width={250} height={250} />
              <h3 className="text-center fst-italic fw-normal">
                Add Some moments of your life here
              </h3>
            </div>
          </>
        )}
      </section>

      {isError && (
        <div>
          <p className="text-gray-500">Error Fetching posts!</p>
        </div>
      )}
    </div>
  );
};

export default AllPosts;
