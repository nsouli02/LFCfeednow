# LFC Feed Now 🔴⚽

**Latest Liverpool FC News in Real Time**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-Visit_Now-red?style=for-the-badge)](https://your-domain.com)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🎯 About

LFC Feed Now is a real-time news aggregation platform dedicated to Liverpool FC fans. Get the latest transfer updates, match reports, rumors, and breaking news from trusted sources - all in one place, updated every minute.

**🔗 [Visit LFC Feed Now →](https://your-domain.com)**

## ✨ Features

- 🚀 **Real-time Updates** - News refreshed every minute
- 📱 **Mobile Responsive** - Perfect experience on all devices  
- 🎨 **Modern UI** - Clean, fast, and intuitive interface
- 📰 **Multiple Sources** - Aggregated from trusted Liverpool FC news sources
- 🔍 **Smart Filtering** - Only Liverpool FC related content
- ⚡ **Lightning Fast** - Built with Next.js for optimal performance
- 🎯 **No Clutter** - Clean, focused news without distractions
- 📊 **Admin Panel** - Easy content management for manual posts

## 🏟️ What You'll Find

- **Transfer News** - Latest signings, rumors, and market updates
- **Match Reports** - Live updates, results, and analysis
- **Team News** - Squad updates, injuries, and formations
- **Manager Updates** - Press conferences and tactical insights
- **Fan Content** - Community-driven posts and discussions

## 🛠️ Technical Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Deployment**: Vercel/Your hosting platform
- **Data Sources**: RSS feeds from trusted LFC news sources

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LFCfeednow.git
   cd LFCfeednow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_SESSION_SECRET=your_admin_secret
   ```

4. **Set up the database**
   See [Database Setup](#database-setup) section below.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄️ Database Setup

Create the required tables in your Supabase database:

```sql
-- Manual posts table for admin-created content
CREATE TABLE IF NOT EXISTS public.manual_posts (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  full_text text,
  media_url text,
  permalink_url text,
  timestamp timestamptz NOT NULL,
  source_label text
);

-- Admins table for authentication
CREATE TABLE IF NOT EXISTS public.admins (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  password_hash text
);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('manual-posts-media', 'manual-posts-media', true);

-- Set up storage policies
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'manual-posts-media');

CREATE POLICY "Admin upload access" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'manual-posts-media');
```

### Admin Setup

Generate an admin password hash:

```bash
node scripts/hash-code.mjs your-password
```

Insert the admin user:

```sql
INSERT INTO public.admins (password_hash)
VALUES ('$2a$10$your_generated_hash_here');
```

## 🔧 Configuration

### RSS Sources

The app automatically fetches from configured RSS sources. You can modify the sources in `src/lib/rssSources.ts`:

```typescript
export const RSS_FEEDS = [
  {
    name: 'The Anfield Wrap',
    url: 'https://www.theanfieldwrap.com/feed/',
    filterLiverpoolOnly: true
  },
  // Add more sources...
];
```

### Alternative Database Schema

If you prefer using an existing `Adminpost` table, set this environment variable:

```env
NEXT_PUBLIC_SUPABASE_POSTS_TABLE=Adminpost
```

## 📱 Features in Detail

### Real-time Feed
- Automatic refresh every minute
- Smart content filtering for Liverpool FC relevance
- Clean, card-based layout for easy reading

### Admin Panel
- Secure login system
- Create, edit, and delete manual posts
- Media upload support (images and videos)
- Content management interface

### SEO Optimized
- Structured metadata for search engines
- Sitemap generation
- OpenGraph and Twitter Card support
- Fast loading times

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help setting up the project, please:

- Open an issue on GitHub
- Check the documentation
- Visit the live site: **[LFC Feed Now](https://your-domain.com)**

---

**You'll Never Walk Alone** 🔴

Built with ❤️ for Liverpool FC fans worldwide.

---

## 📊 Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── post/           # Individual post pages
│   └── layout.tsx      # Root layout
├── components/         # React components
├── lib/                # Utility functions
│   ├── adminStore.ts   # Database operations
│   ├── aggregator.ts   # Feed aggregation
│   ├── rssSources.ts   # RSS feed configuration
│   └── sanitize.ts     # Text processing
└── types/              # TypeScript definitions
```

## 🔄 Updates

This project is actively maintained. Check the [releases](https://github.com/yourusername/LFCfeednow/releases) for the latest updates and features.

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub and share it with fellow Liverpool FC fans!

**[🌐 Visit LFC Feed Now](https://your-domain.com)**