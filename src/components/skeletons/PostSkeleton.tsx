const PostSkeleton = () => {
  return (
    <div className="w-full max-w-sm my-5 bg-white border border-gray-300 rounded-lg shadow flex flex-col">
      {/* Header */}

      <div className="p-2 flex items-center gap-2">
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>

        <div className="w-full h-3 mx-5 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Image */}
      <div className="w-full h-[220px] bg-gray-300 animate-pulse"></div>

      {/* Post contents */}
      <div className="p-2 flex flex-col space-y-2">
        <div className="flex space-x-3">
          {/* Tags  */}
          <div className="w-1/6 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-1/6 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-1/6 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Text content  */}
        <div className="my-1"></div>
        <div className="w-full h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-full h-3 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-3/4 h-3 bg-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
