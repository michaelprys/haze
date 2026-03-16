# Haze

*An elegant space to share your moments 🌌*

🔗 **Demo:** [hazeapp.netlify.app](https://hazeapp.netlify.app/)

---

## Experience

### Photo Posting
- **Capture or Upload** — take a photo using the built-in camera integration or upload from your device.  
- **Smart Location** — one-tap location tagging via the browser Geolocation API.

### Profile Updates
Instantly update your avatar, username, or bio without navigating through menus.

### Smooth UX
- Infinite scrolling feed  
- Fast loading and instant feedback

---

## Technical Highlights

### Auth & Security
Full authentication flow (Sign-up, Sign-in, Password Reset) powered by **Supabase**.  
Each user can access only their own data and images (RLS).

### Performance
- Lazy-loaded components  
- Responsive design  
- Quick loading of posts and images

---

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Quasar, Pinia, SCSS  
- **Backend:** Supabase (PostgreSQL, Auth, Storage)  

---

## Getting Started

### Clone & Install

```bash
git clone https://github.com/michaelprys/haze.git
cd haze
pnpm install
# or
npm install
