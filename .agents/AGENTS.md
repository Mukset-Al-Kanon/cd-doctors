# Project Rules & Design Preferences

## Doctor Profile Card Standard Structure & Preferences
All doctor profile cards across the platform (e.g. Doctor Directory, Hospital Detail pages, Doctor Booking) MUST strictly adhere to this exact structure and design:

1. **Header Profile Area**:
   - **Doctor Photo**: Enlarged, prominent 1:1 square ratio (`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover object-top border-2 border-white shadow-md`).
   - **Department Badge**: Sky badge (`bg-sky-50 text-sky-700 font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg border border-sky-100/90`).
   - **Doctor Name**: Bold, navy title (`font-black text-base sm:text-lg text-nuvicaNavy-900 leading-snug`).
   - **Degrees & Specialization**: Clean subtitle with degrees (`text-xs text-slate-500 font-medium`) and specialization (`text-xs font-bold text-sky-700`).

2. **Chamber & Schedule Box**:
   - **Hospital Name**: (`🏢 Hospital Name`).
   - **Weekly Schedule**: (`📅 চেম্বারের দিনসমূহ:`) with Bangla short day names (`শনি`, `রবি`, `সোম`, `মঙ্গ`, `বুধ`, `বৃহ`, `শুক্র`). Available days are highlighted with sky-blue pills (`bg-sky-500 text-white shadow-2xs`) and closed days are muted with line-through (`line-through opacity-60`).
   - **Fee & Experience Row**: (`ভিজিট ফি: ৳X টাকা` | `অভিজ্ঞতা: X বছর`).

3. **Expandable Accordion Bar**:
   - Label: `ⓘ  অভিজ্ঞতা ও চিকিৎসাসমূহ ∨` with `tracking-wide font-bold`.
   - On click: Expands doctor bio (`ডাক্তারের বিবরণ:`) and treated diseases list (`যেসব রোগের চিকিৎসাসেবা প্রদান করেন:`).

4. **Primary Action Call Button**:
   - Direct Call Button: `📞 সিরিয়ালের জন্য কল করুন` with `href="tel:phone_number"`.
