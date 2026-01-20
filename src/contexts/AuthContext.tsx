// import { createContext, useContext, useEffect, useState } from "react";
// import { apiGet, apiPost } from "../lib/api";
// import { Profile } from "../types";

// interface AuthContextType {
//   user: any | null;
//   profile: Profile | null;
//   loading: boolean;
//   signIn: (
//     email: string,
//     password: string
//   ) => Promise<{ error: Error | null }>;
//   signUp: (
//     email: string,
//     password: string,
//     fullName: string,
//     role?: "super_admin" | "researcher"
//   ) => Promise<{ error: Error | null }>;
//   signOut: () => Promise<void>;
//   isAdmin: boolean;
//   isResearcher: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any | null>(null);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load user on first load (if token exists)
//   // useEffect(() => {
//   //   const token = localStorage.getItem("token");

//   //   if (!token) {
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   (async () => {
//   //     try {
//   //       const data = await apiGet("/api/auth/profile", token);

//   //       if (data?.user) {
//   //         setUser(data.user);
//   //         setProfile(data.profile || null);
//   //       }
//   //     } catch (error) {
//   //       console.error("Auth load error:", error);
//   //       localStorage.removeItem("token");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   })();
//   // }, []);


// //   useEffect(() => {
// //   const token = localStorage.getItem("token");

// //   if (!token) {
// //     setLoading(false);
// //     return;
// //   }

// //   (async () => {
// //     try {
// //       const data = await apiGet("/api/auth/profile", token);

// //       if (data?.id) {
// //         setUser({ id: data.id, email: data.email });  // minimal user
// //         setProfile(data);
// //       } else {
// //         localStorage.removeItem("token");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       localStorage.removeItem("token");
// //     } finally {
// //       setLoading(false);
// //     }
// //   })();
// // }, []);


//   useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     setLoading(false);
//     return;
//   }

//   (async () => {
//     try {
//       const data = await apiGet("/api/auth/profile", token);

//       if (data?.id) {
//         // Save minimal user object
//         setUser({
//           id: data.id,
//           email: data.email,
//           role: data.role
//         });

//         // Save profile object
//         setProfile({
//           id: data.id,
//           full_name: data.full_name,
//           email: data.email,
//           role: data.role
//         });
//       } else {
//         localStorage.removeItem("token");
//       }
//     } catch (err) {
//       console.error("Profile fetch failed:", err);
//       localStorage.removeItem("token");
//     } finally {
//       setLoading(false);
//     }
//   })();
// }, []);



//   // SIGN IN (Backend login)
//   const signIn = async (email: string, password: string) => {
//     try {
//       const data = await apiPost("/api/auth/login", { email, password });

//       if (data.error) {
//         return { error: new Error(data.error) };
//       }

//       // if (data.token) {
//       //   localStorage.setItem("token", data.token);
//       //   setUser(data.user);
//       //   setProfile(data.profile || null);
//       // }

//       if (data.token) {
//         localStorage.setItem("token", data.token);

//         setUser({
//           id: data.user.id,
//           email: data.user.email,
//           role: data.user.role
//         });

//         setProfile({
//           id: data.user.id,
//           full_name: data.user.full_name,
//           email: data.user.email,
//           role: data.user.role
//         });
//       }


//       return { error: null };
//     } catch (error) {
//       return { error: error as Error };
//     }
//   };

//   // SIGN UP (Backend register)
//   const signUp = async (
//     email: string,
//     password: string,
//     fullName: string,
//     role: "super_admin" | "researcher" = "researcher"
//   ) => {
//     try {
//       const data = await apiPost("/api/auth/register", {
//         email,
//         password,
//         fullName,
//         role,
//       });

//       if (data.error) {
//         return { error: new Error(data.error) };
//       }

//       return { error: null };
//     } catch (error) {
//       return { error: error as Error };
//     }
//   };

//   // SIGN OUT
//   const signOut = async () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setProfile(null);
//   };

//   const value: AuthContextType = {
//     user,
//     profile,
//     loading,
//     signIn,
//     signUp,
//     signOut,
//     isAdmin: profile?.role === "super_admin",
//     isResearcher:
//       profile?.role === "researcher" || profile?.role === "super_admin",
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }


import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from "../lib/api";
import { Profile } from "../types";

interface AuthContextType {
  user: { id: number; email: string; role?: string } | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: "super_admin" | "researcher"
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isResearcher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: number; email: string; role?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // api.ts already adds base /api and Authorization header via localStorage
        const data = await apiGet("/auth/me");

        if (data?.id) {
          setUser({ id: data.id, email: data.email, role: data.role });
          setProfile({
            id: data.id,
            full_name: data.full_name,
            email: data.email,
            role: data.role,
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch (err){
        console.error("Profile fetch failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // SIGN IN
  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiPost("/auth/login", { email, password });

      if (data?.error) return { error: new Error(data.error) };
      if (!data?.token || !data?.user) return { error: new Error("Login failed") };

      localStorage.setItem("token", data.token);

      setUser({ id: data.user.id, email: data.user.email, role: data.user.role });
      setProfile({
        id: data.user.id,
        full_name: data.user.full_name,
        email: data.user.email,
        role: data.user.role,
      });

      return { error: null };
    } catch (e: any) {
      return { error: new Error(e?.message || "Network error") };
    }
  };

  // SIGN UP
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "super_admin" | "researcher" = "researcher"
  ) => {
    try {
      // Backend expects full_name
      const data = await apiPost("/auth/register", {
        email,
        password,
        full_name: fullName,
        role,
      });

      if (data?.error) return { error: new Error(data.error) };

      // If your backend returns token+user on register, auto-login:
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        setUser({ id: data.user.id, email: data.user.email, role: data.user.role });
        setProfile({
          id: data.user.id,
          full_name: data.user.full_name,
          email: data.user.email,
          role: data.user.role,
        });
      }

      return { error: null };
    } catch (e: any) {
      return { error: new Error(e?.message || "Network error") };
    }
  };

  // SIGN OUT
  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === "super_admin",
    isResearcher: profile?.role === "researcher" || profile?.role === "super_admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
