"use client";

import Createpost from "@/components/Createpost";
import AllPosts from "@/components/AllPosts";
import { useAppContext } from "@/context/AppContext";
import WelcomeBox from "@/components/WelcomeBox";
import Footer from "@/components/Footer";

export default function Home() {
  const { user } = useAppContext();

  return (
    <>
      <div className="max-md:pt-14">
        {user ? (
          <>
            <Createpost />
          </>
        ) : (
          <>
            <WelcomeBox />
          </>
        )}

        <AllPosts />

        <Footer />
      </div>
    </>
  );
}
