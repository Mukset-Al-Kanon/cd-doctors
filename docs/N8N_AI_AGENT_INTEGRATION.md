# 🌐 CD Doctors — Universal n8n AI Agent Integration (Full Website Data)

Connect your **n8n AI Agent** directly to the **CD Doctors Central Real-Time Database** to give your AI Agent complete knowledge of the **entire website** across **Facebook Messenger**, **WhatsApp Business**, **Telegram**, and your **Website Chatbot**.

---

## 🌟 1. All Website Information Included

Your n8n AI Agent can now answer questions about:
1. 🩺 **ডাক্তার ও চেম্বার (Doctors)**: ৩০ জন বিশেষজ্ঞ ডাক্তারের নাম, ডিগ্রি, বিশেষত্ব, ফি, চেম্বার রুম, সাপ্তাহিক শিডিউল, ফোন নম্বর ও উপসর্গ (Symptoms) ম্যাপিং।
2. 🏥 **হাসপাতাল ও ক্লিনিক (Hospitals)**: চুয়াডাঙ্গার ৫টি প্রধান হাসপাতালের সুযোগ-সুবিধা (ICU, CCU, Emergency, 24h Pharmacy), ঠিকানা, হেল্পলাইন ও ডাক্তারদের তালিকা।
3. 🩸 **রক্তদাতা নেটওয়ার্ক (Blood Donors)**: A+, B+, O+, AB+, O-, A-, B- গ্রুপের যাচাইকৃত রক্তদাতাদের নাম, ফোন নম্বর, এলাকা ও প্রাপ্যতা।
4. 🚑 **জরুরি অ্যাম্বুলেন্স ও হেল্পলাইন (Emergency 24/7)**: চুয়াডাঙ্গা সদর হাসপাতাল জরুরি বিভাগ, ৯৯৯ জাতীয় জরুরি সেবা, ফায়ার সার্ভিস ও রেড ক্রিসেন্ট ব্লাড হেল্পলাইন।
5. 🧪 **ডায়াগনস্টিক টেস্টের মূল্য তালিকা (Diagnostic Tests)**: CBC, HbA1c, Creatinine, Lipid Profile, ECG, Echo, USG, X-Ray সহ টেস্টের দাম ও কোথায় পাওয়া যায়।
6. 🏢 **প্লাটফর্ম ও ফাউন্ডার তথ্য (Platform & Founder Info)**: CD Doctors কী, ফাউন্ডার Mukset Al Kanon-এর ভিশন, সার্ভিস ও যোগাযোগের ঠিকানা।

---

## 🔑 2. Authentication

- **Header**: `x-api-key: cddoctors_n8n_sec_key_2026`
- **Or Query Param**: `?apiKey=cddoctors_n8n_sec_key_2026`

---

## ⚡ 3. Universal Master AI Endpoint: `/api/ai/query-master`

- **Endpoint URL**: `https://<YOUR_APP_DOMAIN>/api/ai/query-master` (e.g., `http://localhost:3000/api/ai/query-master`)
- **Method**: `GET` or `POST`
- **Headers**:
  ```http
  x-api-key: cddoctors_n8n_sec_key_2026
  Content-Type: application/json
  ```

### Query Parameters / Body:
| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `query` | string | `"A+ রক্ত লাগবে"` or `"Evercare Hospital"` or `"বুকে ব্যথা"` or `"CBC টেস্টের দাম"` | যেকোনো প্রশ্ন বা কিওয়ার্ড |
| `category` | string | `"all"` \| `"doctors"` \| `"hospitals"` \| `"blood"` \| `"emergency"` \| `"tests"` \| `"platform"` | নির্দিষ্ট ক্যাটাগরি ফিল্টার (ঐচ্ছিক) |
| `limit` | number | `5` | সর্বোচ্চ ফলাফল সংখ্যা |

---

## 🧪 4. Live Examples (টেস্ট করার লিঙ্কসমূহ)

### ১. ব্লাড ডোনার খোঁজা:
👉 `http://localhost:3000/api/ai/query-master?query=রক্তদাতা&apiKey=cddoctors_n8n_sec_key_2026`

### ২. হাসপাতাল ও জরুরি অ্যাম্বুলেন্স খোঁজা:
👉 `http://localhost:3000/api/ai/query-master?query=অ্যাম্বুলেন্স&apiKey=cddoctors_n8n_sec_key_2026`

### ৩. ডায়াগনস্টিক টেস্ট ও মূল্য তালিকা:
👉 `http://localhost:3000/api/ai/query-master?query=CBC টেস্টের দাম&apiKey=cddoctors_n8n_sec_key_2026`

### ৪. ডাক্তার বা শারীরিক সমস্যা (লক্ষণ):
👉 `http://localhost:3000/api/ai/query-master?query=বাচ্চাদের ডাক্তার&apiKey=cddoctors_n8n_sec_key_2026`

### ৫. ওয়েবসাইট ও প্রতিষ্ঠাতা সম্পর্কে:
👉 `http://localhost:3000/api/ai/query-master?query=CD Doctors সম্পর্কে&apiKey=cddoctors_n8n_sec_key_2026`

---

## 🤖 5. n8n AI Agent Setup (HTTP Request Node)

1. n8n ক্যানভাসে **HTTP Request** নোড যুক্ত করুন।
2. কনফিগার করুন:
   - **Method**: `GET`
   - **URL**: `https://<YOUR_APP_DOMAIN>/api/ai/query-master`
   - **Send Query Parameters**: `true`
     - `query`: `{{ $json.user_message }}`
   - **Send Headers**: `true`
     - `x-api-key`: `cddoctors_n8n_sec_key_2026`
3. আউটপুটের `ai_context_string` দিয়ে আপনার OpenAI / Gemini AI Agent-কে প্রম্পট দিন অথবা সরাসরি `messenger_card_text` রোগীকে ফেসবুক/হোয়াটসঅ্যাপে পাঠিয়ে দিন।

---

## 🔄 6. রিয়েল-টাইম লাইভ সিঙ্ক গ্যারান্টি
অ্যাডমিন প্যানেল (`/admin/doctors`, `/admin/hospitals`, `/admin/blood`, `/admin/emergency`) থেকে যেকোনো তথ্য আপডেট করলে n8n AI তাৎক্ষণিকভাবে কোনো ক্যাশ ডিলে ছাড়াই নতুন তথ্য রিটার্ন করবে।
