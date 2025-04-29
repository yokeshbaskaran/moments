"use client";

import { createPost } from "@/app/actions/posts";
import { useAppContext } from "@/context/AppContext";
import { uploadImage } from "@/supabase/storage/upload-img";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FiUpload } from "react-icons/fi";

const Createpost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [postImgView, setPostImgView] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAppContext();
  const [isPending, startTransition] = useTransition();

  //image and set-preview image
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      // console.log("image file name", postImgView);
      setPostImgView(imageFile);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //submit user-data
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      e.preventDefault();

      if (!title || !description || !tags || !postImgView) {
        toast.error("Enter all details");
        return;
      }

      let imgUrl: string | null = "";
      if (postImgView) {
        imgUrl = await uploadImage(postImgView);
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);

      if (user) {
        console.log("user details:", user?.id, user?.user_metadata);
        formData.append("userId", user?.id);
        formData.append("username", user?.user_metadata?.username);
      }

      if (imgUrl) {
        formData.append("image", imgUrl);
      }

      // Triggering the mutation
      mutation.mutate(formData);
    });
  };

  const queryClient = useQueryClient();

  //creating post
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await createPost(formData);
      if (res.success) {
        return res;
      } else {
        throw new Error(res.message || "Error in creating post");
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // 'posts
      setTitle("");
      setDescription("");
      setTags("");
      setPostImgView(null);
    },
    onError: (error) => {
      toast.error(error.message || "Error in creating post");
    },
  });

  return (
    <>
      <div
        style={{
          background: "linear-gradient(to right,#4facfe,#b600fe)",
          padding: "2rem 0.5rem",
          textAlign: "left",
          color: "white",
        }}
      >
        <form
          className="mx-1 md:mx-10 px-3 md:px-5 py-2 rounded text-black bg-white"
          onSubmit={handleSubmit}
        >
          {/* <h2 className="py-3 text-2xl font-normal">Share the Moments</h2> */}
          <h2 className="py-3 text-2xl font-semibold italic bg-clip-text text-transparent bg-gradient-to-r from-[#4facfe] to-[#b600fe]">
            Share the Moments
          </h2>

          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input-form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className="input-form"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="input-form"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* File image  */}
          <div className="my-2">
            <label htmlFor="image">Upload Image</label>

            {!postImgView && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  hidden
                  placeholder="select image"
                  onChange={handleFile}
                  ref={fileInputRef}
                />

                <button
                  onClick={handleClick}
                  className="w-fit my-2 px-2 py-2 flex items-center gap-1 border rounded-lg cursor-pointer"
                  style={{
                    background: "linear-gradient(to right,#4facfe,#b600fe)",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  <FiUpload color="white" size={20} />

                  <span>Upload Image</span>
                </button>
              </div>
            )}

            {postImgView && (
              <div className="w-fit my-3 flex gap-5">
                <Image
                  src={URL.createObjectURL(postImgView)}
                  width={200}
                  height={200}
                  alt="task-img-selected"
                  className="object-cover"
                />

                <CgClose
                  color="red"
                  size={32}
                  className="p-1 border-gray-400 rounded-full cursor-pointer hover:border"
                  onClick={() => setPostImgView(null)}
                />
              </div>
            )}
          </div>

          <button
            className={`my-2 px-7 py-2 text-white rounded bg-green-700 ${
              isPending ? "opacity-70" : ""
            } cursor-pointer`}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Posting" : "Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Createpost;
