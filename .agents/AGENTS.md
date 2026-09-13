# Project Rules & Design Preferences

## Doctor Profile Card Standard Structure & Preferences
All doctor profile cards across the platform (e.g. Doctor Directory, Hospital Detail pages, Doctor Booking, Telemedicine) MUST strictly adhere to this exact structure and design:

1. **Top Section (Photo on Left + Credentials on Right)**:
   - **Doctor Photo**: Left side 1:1 square ratio (`aspect-square w-[110px] sm:w-[130px] md:w-[140px] shrink-0 rounded-2xl overflow-hidden shadow-xs border-2 border-white bg-slate-100 cursor-pointer`), zoomable on click (opens Lightbox modal). No badges on photo (verified badge stays beside doctor name).
   - **Credentials (Beside Photo)**:
     - **Doctor Name & Verified Badge**: Bold, navy title (`font-black text-base sm:text-lg text-nuvicaNavy-950 leading-snug`). The official verified badge (`<OfficialVerifiedBadge />`) MUST always be pinned to the right of the first line of the doctor's name using `flex items-start gap-1.5` so it stays beside the first line even if the name wraps.
     - **Degrees**: Clean subtitle with degrees (`text-[11.5px] sm:text-xs text-slate-400 font-medium line-clamp-2`).
     - **Specialization**: Clean text (`text-xs sm:text-[13.5px] font-black text-sky-700 leading-snug`).

2. **Official Verified Badge Standard**:
   - The website's official verified badge is the 12-point scalloped starburst blue badge with a crisp white checkmark (`/icons/official_verified_badge.png`).
   - Reusable component: `src/components/OfficialVerifiedBadge.tsx`.
   - Never use generic Lucide `BadgeCheck` or ad-hoc SVG icons for verified doctor badges.

3. **Bottom Section (2 Action Buttons Side-by-Side)**:
   - **Left Button**: `🏢 চেম্বার ও সময়` (or `📹 টেলিমেডিসিন` on telemedicine page) (`bg-gradient-to-r from-sky-600 to-sky-700 text-white font-black rounded-2xl`): Shows chamber schedule / booking modal.
   - **Right Button**: `👤 প্রোফাইল` (`bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200/80 font-black rounded-2xl`): Direct link to doctor detail profile page.

4. **Color Palette & Theme Integrity**:
   - Card container must retain `bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300`.
   - Navy text (`text-nuvicaNavy-950`), Sky-blue accents (`bg-sky-50`, `text-sky-700`, `bg-sky-600`), and soft slate borders.

