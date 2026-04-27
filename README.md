# VipBooker | VIP Transfer & Tour Booking Platform 🏎️💨

VipBooker is a premium, high-performance web application designed for VIP transportation services, agency management, and tour bookings. Built with the latest tech stack, it provides a seamless experience for both customers and service providers.

## ✨ Key Features

### 👤 Customer Dashboard
- Real-time booking tracking.
- Past and active reservation management.
- Transparent status updates (Pending Deposit, Confirmed, Cancelled).

### 🔍 Advanced Search Engine
- Dynamic filtering by City, Date, and Passenger Capacity.
- High-performance search powered by Supabase.

### 🏢 Agency & Driver Management (Umbrella System)
- Role-Based Access Control (RBAC).
- Agencies can manage their own fleet and view their specific bookings.
- Administrative dashboard for platform-wide management.

### 🗺️ Tour Modules
- Exclusive tour packages (e.g., Cappadocia Balloon Tour, Antalya Waterfalls).
- Detailed tour descriptions and agency contact integration.

### ⚡ Technical Excellence
- **Speed:** Next.js 15+ with Turbopack for lightning-fast builds.
- **SEO:** Dynamic Metadata generation for high social media visibility.
- **Performance:** Optimized images using `next/image` with modern remote patterns.
- **Design:** Premium dark-themed UI using Tailwind CSS and Framer Motion for smooth animations.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mrvinsky/vip-booker-demo.git
   cd vip-booker-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is optimized for [Vercel](https://vercel.com).
- Ensure environment variables are set in the Vercel Project Settings.
- The build process is automated via GitHub integration.

---

Built with ❤️ by [Vinsky](https://github.com/mrvinsky)
