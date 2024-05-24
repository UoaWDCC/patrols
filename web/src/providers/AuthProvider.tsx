import { useState, useEffect, PropsWithChildren } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseClient } from '../auth-client/SupabaseClient';
import { AuthContext } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface ChildrenType extends PropsWithChildren {}

export default function AuthProvider({ children }: ChildrenType) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getSessionData = async function () {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (error) {
        console.log(`Error: ${error}`);
      }
      setUser(session?.user);
      setLoading(false);
    };

    const { data: listener } = supabaseClient.auth.onAuthStateChange(function (
      _event,
      session
    ) {
      setUser(session?.user);
      setLoading(false);
    });

    getSessionData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    signOut: () => {
      queryClient.removeQueries();
      supabaseClient.auth.signOut();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
