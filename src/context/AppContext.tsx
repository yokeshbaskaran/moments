"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabaseClient } from "@/supabase/client";
import type { User } from "@supabase/supabase-js";

//query-client
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  dataChanged: boolean;
  setDataChanged: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppContextProvider = ({
  children,
  serverUser,
}: {
  children: React.ReactNode;
  serverUser: User | null;
}) => {
  const [user, setUser] = useState<User | null>(serverUser);
  // const [loading, setLoading] = useState(!serverUser);

  const { auth } = supabaseClient();

  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    if (!serverUser) {
      const getUser = async () => {
        const {
          data: { session },
        } = await auth.getSession();
        setUser(session?.user ?? null);
        // setLoading(false);
      };

      getUser();
    }

    const { data: listener } = auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [auth, serverUser]);

  const contextValues = {
    user,
    setUser,
    dataChanged,
    setDataChanged,
  };

  return (
    <>
      <AppContext.Provider value={contextValues}>
        {children}
      </AppContext.Provider>
    </>
  );
};

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
