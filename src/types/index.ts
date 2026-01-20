// import { Database } from './database';

// export type Profile = Database['public']['Tables']['profiles']['Row'];
// export type Category = Database['public']['Tables']['categories']['Row'];
// export type Tag = Database['public']['Tables']['tags']['Row'];
// export type Post = Database['public']['Tables']['posts']['Row'];
// export type Media = Database['public']['Tables']['media']['Row'];
// export type ModerationLog = Database['public']['Tables']['moderation_log']['Row'];

// export type PostWithAuthor = Post & {
//   profiles: Pick<Profile, 'full_name' | 'avatar_url'>;
//   categories: Pick<Category, 'name' | 'slug'> | null;
// };

// export type PostWithDetails = PostWithAuthor & {
//   post_tags: Array<{
//     tags: Tag;
//   }>;
//   media: Media[];
// };

import { Database } from './database';

// Keep the raw DB shape for reference if you ever need it
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Media = Database['public']['Tables']['media']['Row'];
export type ModerationLog = Database['public']['Tables']['moderation_log']['Row'];

// App-facing ID can be number (backend) or string (DB UUID)
type ID = number | string;

// App-facing Profile used in React code
export type Profile = {
  id: ID;
  full_name: string;
  email: string; // add email for UI use
  role: 'super_admin' | 'researcher' | 'user';
  bio?: string;
  avatar_url?: string;
  created_at?: string;
};

export type PostWithAuthor = Post & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url'>;
  categories: Pick<Category, 'name' | 'slug'> | null;
};

export type PostWithDetails = PostWithAuthor & {
  post_tags: Array<{ tags: Tag }>;
  media: Media[];
};
