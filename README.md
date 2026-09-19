# Madmak Vision

## نظام عروض الأسعار

لوحة الإدارة متاحة على المسار:

```text
/admin/login
```

اضبط المتغيرات التالية قبل التشغيل:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only-service-role-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=use-a-long-random-password
ADMIN_SESSION_SECRET=use-a-separate-long-random-secret
CHROMIUM_EXECUTABLE_PATH=/path/to/chrome-or-chromium
QUOTATIONS_DATA_DIR=/persistent/path/madmak-quotations
```

- يبدأ ترقيم عروض الأسعار من `1168` عبر Sequence في Postgres.
- تُحفظ البيانات وسجل الأحداث في Supabase Postgres، وملفات PDF داخل `QUOTATIONS_DATA_DIR`.
- المستخدمون (مدير/مبيعات) من صفحة `/admin/users`، وأول مدير يُنشأ من `ADMIN_USERNAME`/`ADMIN_PASSWORD`.
- المنتجات تُحفظ تلقائياً عند إصدار العرض ويمكن اختيارها من قائمة بحث، مع خصم بنسبة أو مبلغ ثابت.
- يُحفظ ملف PDF النهائي مع بصمة SHA-256 ولا يتم تعديل الملف عند إلغاء العرض.
- اختيار الضريبة يدوي لكل منتج: بدون ضريبة أو 15%.
- حالات متابعة العرض: مؤقت، تم التعميد، قيد التنفيذ، تم الإرسال، ومنتهي.
- دليل عملاء دائم، ولكل عميل قائمة مستقلة من المسؤولين وأرقام التواصل.
- يمكن إنشاء العميل أو المسؤول من داخل نموذج عرض السعر، ثم إعادة استخدامه في العروض اللاحقة.
- تغيير حالة المتابعة لا يعدّل نسخة بيانات العرض الأصلية، ويُسجل كل انتقال في سجل التدقيق.
- المتصفح المطلوب لتوليد PDF هو Google Chrome أو Chromium. على macOS يُكتشف Google Chrome تلقائياً.

يجب أن يشير `QUOTATIONS_DATA_DIR` في بيئة الإنتاج إلى قرص دائم تتم حمايته ونسخه احتياطياً. التخزين المحلي المؤقت في منصات serverless لا يصلح لأرشيف التدقيق.

```bash
pnpm install
pnpm dev
```
