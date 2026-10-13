# Madmak Vision SEO handoff

Audit date: 2026-10-12. Store: `https://madmakvision.com` (Salla). Landing: `https://madmakvi.com` (this repo, Vercel).

## 1. Domains

| Site | Host | Status |
| --- | --- | --- |
| Store `madmakvision.com` | Salla (`ns1/ns2.salla.cloud`, Cloudflare) | HTTPS ok, `www` and `http` 301 to `https://madmakvision.com` |
| Landing `madmakvi.com` | Vercel | Serves this repo. Canonical `https://madmakvi.com` is correct, `defaultSiteUrl` needs no change |

Two things to fix on the landing domain:

- Production still serves the build from `main` (deployed about 14 days before the audit). `/physiotherapy-equipment` returns 404 there and the sitemap lists only the home page. Nothing on the SEO branch is live until it is merged to `main`.
- `https://www.madmakvi.com` fails with a certificate error. Add `www.madmakvi.com` to the Vercel project and redirect it to the apex.

## 2. Store audit (Salla)

SEO fields are edited in the Salla dashboard (product or category → تحسينات SEO; store-level under إعدادات المتجر → SEO). Nothing here could be applied without the merchant login.

Catalog: 307 products (300 in stock, 7 out), 19 categories, prices 2 to 73,000 SAR.

### Critical

1. **No sitemap.** `robots.txt` declares `https://madmakvision.com/sitemap.xml`, which returns 404 (also for Googlebot's user agent). `sitemap_index.xml` returns 410. Ask Salla support to enable or regenerate the sitemap, then submit it in Search Console.
2. **The store is not indexed.** `site:madmakvision.com` returns nothing on Bing, and no page of the store appeared for any brand or product query tested. Verify the domain in Google Search Console and Bing Webmaster Tools, submit the sitemap, and request indexing for the home page and the 17 category URLs below. (Google itself could not be queried from the audit machine, so confirm the Google count in Search Console.)
3. **Category pages have no crawlable product links.** Products load client-side through `<salla-products-list>`; the HTML of every category contains 0 product URLs. Without a sitemap, crawlers have no plain link to any of the 307 products. The sitemap fix resolves most of this.
4. **Every category shares one meta description** (the store's generic description). Set a unique title and description per category, using section 3.
5. **Home title is just "مدماك فيجن".** Set it to the home title in section 3.

### High

6. **Two empty categories are live and indexable:** `مستلزمات كبار السن` (c473069032) and `مسلتزمات المختبرات` (c1739583988) have 0 products. Add products or hide them until they do. The landing site promotes elderly care, and "سرير طبي" and "كراسي متحركة" are target keywords, but the store sells no medical beds or wheelchairs today.
7. **Typos in category names and slugs:** `مسلتزمات المختبرات` → `مستلزمات المختبرات`; `أجهزة و أدوات أعادة التاهيل` → `أجهزة وأدوات إعادة التأهيل`. Fix the names now. Salla 301-redirects a wrong slug to the current one for categories, so the URL can be corrected too.
8. **Category H1 carries the parent name** ("العلاج الطبيعي و مستلزماته | الأجهزة الكهربائية"). This is the theme's breadcrumb-style heading; if the theme allows, show only the category name.
9. **No product has a brand.** `brand` is empty on all 307 products and `/brands` is empty. Create BTL, Chattanooga, Chinesport and Compex as brands and assign them. This adds `brand` to the Product structured data.
10. **Product images are 1000×1000 PNG.** Mobile Lighthouse on a product page: performance 39, LCP 19.0 s, page weight 4.7 MB, with 5.5 s of savings from image format alone. Re-upload main images as compressed JPG or WebP under 150 KB.
11. **Meta descriptions are auto-cut from the description** and start with an emoji and the product name glued to the first word ("…TENSجهاز تحفيز…"). Write the SEO description field by hand for the top products (section 3).
12. **28 products have no description.** Add at least 100 words of original copy to each.
13. **No analytics.** `google_analytics_id` is null in the store config. Connect GA4 through Salla's Google integration.

### Medium

14. Three duplicate product names: `صندوق اختبار الذكاء والإدراك الخشبي`, `حزام تدريب على المشي`, `دراجة هوائية للأطفال`. Merge or differentiate them.
15. No SKU, GTIN or MPN on any product (structured data falls back to the Salla ID). Add the manufacturer model number as SKU/MPN for branded devices.
16. No reviews, so no star ratings in results. Enable Salla's post-purchase review requests.
17. `og:image` is the 600×300 logo; `twitter:site` is "@". Upload a 1200×630 share image and set the X handle to `@madmakvi`.
18. CLS is 0.37 to 0.50 on home, category and product pages (mobile). This comes from the theme; reserve heights for the banner and product grid if the theme settings allow.
19. `robots.txt` contains a stray rule `Disallow: /*<iframe`. Harmless, but ask Salla to remove it.
20. Structured data has only `Organization` and `WebPage` on categories. No `BreadcrumbList` or `ItemList`. This is theme-level and low priority.

### Already correct

- Canonicals are self-referencing and strip `?sort=`, `?page=` and UTM parameters. Wrong category slugs 301 to the right one.
- Product pages have `Product` + `Offer` JSON-LD with price, `SAR` and `InStock`/`OutOfStock`.
- `lang="ar" dir="rtl"`, one language, so no `hreflang` is needed.
- Product images have alt text (the product name). Lighthouse SEO score is 100 on home, category and product pages.

### Lighthouse, mobile

| Page | Perf | LCP | TBT | CLS | Weight |
| --- | --- | --- | --- | --- | --- |
| Store home | 57 | 2.3 s | 610 ms | 0.50 | 1.2 MB |
| Store category | 70 | 2.7 s | 180 ms | 0.37 | 2.2 MB |
| Store product | 39 | 19.0 s | 230 ms | 0.48 | 4.7 MB |
| Landing home (new build, local) | 92 | 3.4 s | 50 ms | 0 | |
| Landing service page (new build, local) | 93 | 3.2 s | 60 ms | 0 | |

## 3. Copy-ready titles and descriptions for the store

If Salla does not append the store name to a custom title, add ` | مدماك فيجن` at the end.

**Home**

- Title: `مدماك فيجن | متجر أجهزة العلاج الطبيعي ومستلزمات الرعاية النهارية`
- Description: `متجر سعودي لأجهزة العلاج الطبيعي ومستلزمات التأهيل والرعاية النهارية: أجهزة كهربائية، طاولات علاج، أدوات تكامل حسي وعلاج وظيفي وتخاطب، مع توصيل لجميع مدن المملكة.`

**Categories**

| Category (ID) | Products | Title | Description |
| --- | --- | --- | --- |
| العلاج الطبيعي ومستلزماته (c1112889071) | 189 | أجهزة علاج طبيعي ومستلزماته للبيع في السعودية | تسوق أجهزة العلاج الطبيعي: أجهزة كهربائية، طاولات علاج، أدوات تأهيل، علاج مائي، أدوات تقييم ومساج، بأسعار واضحة وتوصيل لجميع مدن المملكة. |
| الأجهزة الكهربائية (c1704436730) | 46 | أجهزة العلاج الكهربائي: تنس، ليزر، شوك ويف، موجات فوق صوتية | أجهزة العلاج الطبيعي الكهربائية من BTL وChattanooga وChinesport: تنبيه كهربائي، موجات فوق صوتية، ليزر، موجات تصادمية وشد فقرات. اطلب الآن من مدماك فيجن. |
| أجهزة BTL (c1269249283) | 17 | أجهزة BTL للعلاج الطبيعي في السعودية | أجهزة BTL للعلاج الطبيعي: الموجات التصادمية BTL-6000، الليزر عالي الشدة، التيكار، شد الفقرات، الموجات فوق الصوتية والتنبيه الكهربائي، مع الأسعار. |
| أجهزة Chattanooga (c460588562) | 9 | أجهزة Chattanooga شاتانوجا للعلاج الطبيعي | أجهزة شاتانوجا: كومبو التنبيه الكهربائي مع الموجات فوق الصوتية، Mobile 2، أجهزة التراساوند وكومبكس لتحفيز العضلات، بأسعار واضحة وتوصيل داخل المملكة. |
| أجهزة Chinesport (c770029847) | 10 | أجهزة Chinesport للعلاج الطبيعي | أجهزة Chinesport: ليزر عالي الطاقة وليزر ماسح، تيكار، موجات تصادمية محمولة وأجهزة شد الفقرات الكهربائية، متوفرة للطلب من مدماك فيجن. |
| طاولات علاج طبيعي ومساج (c22667716) | 12 | طاولات وأسرّة علاج طبيعي ومساج كهربائية وثابتة | سرير وطاولة علاج طبيعي كهربائية بحركتين وثلاث حركات، طاولات مساج قابلة للطي، طاولات كشف وكراسي معالجين، بأسعار واضحة وتوصيل داخل المملكة. |
| أجهزة وأدوات إعادة التأهيل (c755183558) | 75 | أجهزة وأدوات إعادة التأهيل والتمارين العلاجية | متوازي مشي، درج تأهيل، دراجات وأجهزة سير، ألواح توازن، أحزمة مقاومة، عجلة الكتف وطاولات الوقوف. كل ما تحتاجه صالة التأهيل في مكان واحد. |
| أجهزة وأدوات العلاج المائي (c2129153735) | 28 | أجهزة العلاج المائي والكمادات الحارة والباردة | أحواض علاج مائي، سير ودراجة تحت الماء، أجهزة كمادات حارة Hydrocollator، كمادات رملية وجل، أجهزة العلاج بالبرودة وحمام شمع البرافين. |
| أدوات التقييم (c70669797) | 16 | أدوات التقييم في العلاج الطبيعي: جونيوميتر وقياس القبضة | جونيوميتر، مقياس نطاق الحركة، مقياس قوة قبضة اليد، مطرقة أعصاب، موازين وأطقم تقييم سريري لأخصائيي وطلاب العلاج الطبيعي. |
| أجهزة وأدوات المساج (c1444115686) | 13 | أجهزة مساج وأدوات تدليك علاجي | أجهزة مساج وتدليك عميق بالحرارة والبرودة، أدوات جراستون IASTM، أكواب حجامة سيليكون وكمادات كهربائية للاستخدام المنزلي والعيادات. |
| الرعاية النهارية ومستلزماتها (c132318674) | 157 | مستلزمات وتجهيزات مراكز الرعاية النهارية | أدوات العلاج الوظيفي والتخاطب والتكامل الحسي والعلاج الطبيعي للأطفال، مع تجهيزات عيادة التمريض والفصول لمراكز الرعاية النهارية. |
| العلاج الطبيعي (c681365933) | 42 | أجهزة علاج طبيعي للأطفال ومراكز الرعاية | مشايات وواقفات وطاولات وقوف للأطفال، أجهزة سير ودراجات تمارين، ألواح وعوارض توازن وأدوات تأهيل حركي بمقاسات الأطفال. |
| العلاج الوظيفي (c1589097132) | 43 | أدوات علاج وظيفي للأطفال والكبار | ألواح الأوتاد والثقوب، أدوات تقوية اليد والأصابع، لوحات المهارات اليومية وألعاب إدراكية لجلسات العلاج الوظيفي في المراكز والمنزل. |
| عيادات التمريض (c639844008) | 20 | مستلزمات عيادة التمريض للمراكز والمدارس | أجهزة قياس الضغط والسكر والحرارة والأكسجين، نيبولايزر، طاولات كشف، حقيبة إسعافات ومستهلكات طبية لتجهيز عيادة التمريض. |
| مستلزمات النطق والتخاطب (c2054811822) | 13 | أدوات تخاطب ومستلزمات جلسات النطق | أدوات تخاطب للأطفال: بطاقات الكلام، أدوات تدريب الفم واللسان والتنفس، وأجهزة قياس وتأهيل الصوت لأخصائيي النطق والمراكز. |
| التواصل الحسي (c1879596457) | 35 | أدوات تكامل حسي وألعاب حسية للأطفال | أدوات تكامل حسي: أنبوب الفقاعات، الألياف الضوئية، أراجيح حسية، مسبح كرات، بلاطات حسية وسترة ضغط، للمراكز والمنزل. |
| الفصول المدرسية (c531864491) | 6 | أثاث فصول ومراكز رعاية للأطفال | طاولات رياض أطفال دائرية ونصف دائرية، كراسي أطفال ووحدات تخزين خشبية لتجهيز الفصول وقاعات مراكز الرعاية النهارية. |

**Top products** (chosen by search demand; the store exposes no sales counts)

| Product (ID) | Title | Description |
| --- | --- | --- |
| جهاز تنس محمول قناتين (p981974588) | جهاز تنس محمول قناتين TENS للعلاج الطبيعي | جهاز تنس محمول بقناتين للاستخدام المنزلي والعيادات، يُستخدم في برامج تخفيف الألم وتنشيط العضلات. السعر والمواصفات والطلب من مدماك فيجن. |
| جهاز تنس أربع قنوات TENS/EMS | جهاز تنس كهربائي 4 قنوات TENS و EMS | جهاز تنس وتحفيز عضلات بأربع قنوات يجمع نمطي TENS و EMS، مناسب للمنزل والعيادة. اطلع على السعر والمواصفات واطلبه الآن. |
| جهاز تنس 2 قناة بريميرا | جهاز تنس بريميرا قناتين | جهاز تنس بقناتين من Chattanooga للعلاج الطبيعي المنزلي والمهني. السعر والمواصفات والتوصيل داخل المملكة. |
| كومبكس جهاز تحفيز العضلات 4.0 | جهاز كومبكس Compex 4.0 لتحفيز العضلات | جهاز Compex 4.0 لتحفيز العضلات الكهربائي في برامج التدريب والتأهيل. السعر والمواصفات والطلب المباشر. |
| جهاز الموجات التصادمية BTL-6000 (p141329575) | جهاز شوك ويف BTL-6000 الموجات التصادمية الشعاعية | جهاز الموجات التصادمية BTL-6000 Radial Shockwave لعيادات ومراكز العلاج الطبيعي. المواصفات والسعر في السعودية وطلب عرض سعر. |
| جهاز الموجات التصادمية المحمول | جهاز شوك ويف محمول للعلاج الطبيعي | جهاز موجات تصادمية محمول من Chinesport للعيادات والزيارات المنزلية. المواصفات والسعر والطلب من مدماك فيجن. |
| جهاز الليزر عالي الشدة BTL | جهاز ليزر علاج طبيعي عالي الشدة BTL | جهاز ليزر عالي الشدة من BTL لمراكز العلاج الطبيعي. المواصفات والسعر في السعودية وطلب عرض سعر. |
| جهاز ليزر علاجي نقطي Chinesport | جهاز ليزر علاجي نقطي بالأشعة تحت الحمراء | جهاز ليزر نقطي من Chinesport لجلسات العلاج الطبيعي. المواصفات والسعر والتوصيل داخل المملكة. |
| جهاز العلاج بالموجات فوق الصوتية (US) | جهاز موجات فوق صوتية علاج طبيعي (التراساوند) | جهاز موجات فوق صوتية علاجي لعيادات العلاج الطبيعي. المواصفات والسعر والطلب المباشر من مدماك فيجن. |
| جهاز التنبيه الكهربائي مع الموجات فوق الصوتية Chattanooga COMBO | جهاز كومبو شاتانوجا: تنبيه كهربائي وموجات فوق صوتية | جهاز كومبو من Chattanooga يجمع التنبيه الكهربائي والموجات فوق الصوتية في جهاز واحد. المواصفات والسعر وطلب عرض سعر. |
| جهاز شد الفقرات الكهربائي (p295555087) | جهاز شد فقرات الظهر والرقبة الكهربائي | جهاز شد الفقرات الكهربائي لجلسات علاج العمود الفقري في مراكز العلاج الطبيعي. المواصفات والسعر والطلب. |
| طاولة علاج طبيعي كهربائية 3 حركات | سرير علاج طبيعي كهربائي 3 حركات | طاولة وسرير علاج طبيعي كهربائي بثلاث حركات لغرف العلاج والتأهيل. المقاسات والسعر والتوصيل والتركيب. |
| متوازي المشي مع المقابض | متوازي مشي للعلاج الطبيعي Parallel Bars | متوازي مشي مع مقابض لصالات التأهيل الحركي. المقاسات والسعر والتوصيل داخل المملكة. |
| مسبح الكرات الحسي للأطفال | مسبح كرات حسي للأطفال لغرف التكامل الحسي | مسبح كرات حسي للأطفال، مناسب لغرف التكامل الحسي والمراكز والمنزل. المقاسات والسعر والطلب. |
| أنبوب الفقاعات الحسية | أنبوب فقاعات حسي للغرف الحسية | أنبوب فقاعات حسي للتحفيز البصري في غرف التكامل الحسي. المقاسات والسعر والتوصيل. |

## 4. Keyword map

Rule: the store owns product and buying queries; the landing site owns setup, supply and planning queries. Each keyword has one target.

| Keyword | Intent | Site | Target URL |
| --- | --- | --- | --- |
| مدماك فيجن | Brand | Store | `/` |
| أجهزة علاج طبيعي، اجهزة علاج طبيعي للبيع، اجهزة علاج طبيعي السعودية | Buy | Store | `/العلاج-الطبيعي-و-مستلزماته/c1112889071` |
| مستلزمات علاج طبيعي، متجر علاج طبيعي، متجر ادوات علاج طبيعي | Buy | Store | `/العلاج-الطبيعي-و-مستلزماته/c1112889071` |
| أجهزة العلاج الكهربائي، جهاز ليزر علاج طبيعي، سعر جهاز ليزر علاج طبيعي | Buy | Store | `/الأجهزة-الكهربائية/c1704436730` |
| أجهزة BTL، جهاز BTL | Buy (brand) | Store | `/أجهزة-شركة-btl/c1269249283` |
| أجهزة شاتانوجا، جهاز شد فقرات شاتانوجا | Buy (brand) | Store | `/أجهزة-شركة-chattanooga/c460588562` |
| أجهزة Chinesport | Buy (brand) | Store | `/أجهزة-شركة-chinesport/c770029847` |
| جهاز تنس، جهاز تنس علاج طبيعي، جهاز تنس محمول، سعر جهاز تنس | Buy | Store | product `جهاز-تنس-محمول-قناتين-tens/p981974588` |
| جهاز تنس للعضلات، جهاز تحفيز العضلات الكهربائي ems | Buy | Store | product `جهاز تنس أربع قنوات (TENS/EMS)` |
| جهاز شوك ويف، جهاز شوك ويف للعلاج الطبيعي، جهاز الموجات التصادمية، جهاز شوك ويف سعر | Buy | Store | product `جهاز-الموجات-التصادمية-btl-6000-radial-shockwave/p141329575` |
| جهاز شوك ويف محمول | Buy | Store | product `جهاز العلاج بالموجات التصادمية المحمول` |
| جهاز شد فقرات، جهاز شد فقرات الظهر، جهاز شد فقرات الرقبة | Buy | Store | product `جهاز-شد-الفقرات-الكهربائي/p295555087` |
| جهاز موجات فوق صوتية علاج طبيعي | Buy | Store | product `جهاز العلاج بالموجات فوق الصوتية (US)` |
| سرير علاج طبيعي، سرير علاج طبيعي كهربائي، طاولة علاج طبيعي، سرير علاج طبيعي سعر | Buy | Store | `/طاولات-علاج-طبيعي-مساج/c22667716` |
| أدوات إعادة تأهيل، متوازي مشي، درج تأهيل | Buy | Store | `/أجهزة-و-أدوات-أعادة-التاهيل/c755183558` |
| أجهزة العلاج المائي، كمادات حارة علاج طبيعي، جهاز كمادات حارة | Buy | Store | `/أجهزة-و-أدوات-العلاج-المائي/c2129153735` |
| جونيوميتر، أدوات تقييم علاج طبيعي | Buy | Store | `/أدوات-التقييم/c70669797` |
| جهاز مساج، جهاز مساج الرياض، أدوات جراستون | Buy | Store | `/أجهزة-و-أدوات-المساج/c1444115686` |
| ادوات تكامل حسي، العاب حسية للاطفال، ألعاب حسية لأطفال التوحد | Buy | Store | `/التواصل-الحسي/c1879596457` |
| ادوات علاج وظيفي، ادوات علاج وظيفي للاطفال | Buy | Store | `/العلاج-الوظيفي/c1589097132` |
| ادوات تخاطب، ادوات تخاطب للاطفال، اماكن بيع ادوات تخاطب | Buy | Store | `/مستلزمات-النطق-و-التخاطب/c2054811822` |
| مستلزمات الرعاية النهارية | Buy | Store | `/الرعاية-النهارية-و-مستلزماتها/c132318674` |
| تجهيز مراكز علاج طبيعي، تجهيز مركز علاج طبيعي، تجهيز عيادة علاج طبيعي، تكلفة تجهيز عيادة علاج طبيعي (+ الرياض، جدة، الدمام) | Service | Landing | `/physiotherapy-center-setup` |
| توريد أجهزة علاج طبيعي، أجهزة علاج طبيعي للمراكز، أنواع أجهزة العلاج الطبيعي، اجهزه علاج طبيعي حديثه | Supply / research | Landing | `/physiotherapy-equipment` |
| تجهيز غرفة العلاج الكهربائي، الفرق بين التنس و EMS، اختيار أجهزة العلاج الكهربائي | Service / research | Landing | `/electrotherapy-room-setup` |
| تجهيز صالة تأهيل حركي، تجهيز صالة تمارين علاجية | Service | Landing | `/rehabilitation-gym-setup` |
| تجهيز قسم العلاج المائي، تجهيز غرفة علاج مائي | Service | Landing | `/hydrotherapy-thermal-therapy` |
| تجهيز مراكز الرعاية النهارية، تجهيز مركز رعاية نهارية، تجهيز رعاية نهارية، تجهيز غرفة علاج وظيفي، تجهيز غرفة تخاطب (+ الرياض، جدة، الدمام) | Service | Landing | `/daycare-center-setup` |
| تجهيز غرفة تكامل حسي، غرفة تكامل حسي، مكونات غرفة التكامل الحسي | Service | Landing | `/sensory-room-setup` |
| مستلزمات كبار السن، مستلزمات كبار السن الرياض، مستلزمات كبار السن جدة، تجهيز مراكز رعاية كبار السن | Service / buy | Landing | `/elderly-care-supplies` (until the store category has products) |
| سرير طبي، سرير طبي كهربائي، سرير طبي لكبار السن، كراسي متحركة، كرسي متحرك كهربائي | Buy | None yet | The store sells neither. Add the products to `مستلزمات كبار السن`, then target that category |
| كيف تجهز مركز علاج طبيعي، أفضل جهاز تنس للاستخدام المنزلي، اشتراطات مراكز الرعاية النهارية | Informational | Landing (blog, not built) | See content plan |

City modifiers: Google autocomplete returned no city variants for the physiotherapy and day-care setup terms, so the cities are covered inside the two setup pages rather than on separate city pages. City variants do exist for `مستلزمات كبار السن`, `سرير طبي`, `كراسي متحركة`, `جهاز مساج` and `مستلزمات طبية`.

Who ranks now (Bing, Saudi Arabic, 2026-10-12):

- `تجهيز مراكز علاج طبيعي`: saudimedicalstore.com, **madmakvi.com (2nd)**, alwatad.sa, anfas.med.sa, safamed.sa.
- `تجهيز مراكز الرعاية النهارية`: care.saudimedicalstore.com, **madmakvi.com (2nd)**, hrsd.gov.sa, alwatad.sa, haraj.com.sa.
- `أجهزة علاج طبيعي السعودية`: amazon.sa, haraj.com.sa, alwatad.sa, rehabcare.sa, saudimedicalstore.com, spama.sa.
- `جهاز تنس علاج طبيعي`: amazon.sa, saudimedicalstore.com, noon.com, h-medical.sa, safamed.sa.
- `جهاز شوك ويف سعر`: amazon.sa, saudimedicalstore.com, alwatad.sa, al-zhraa.com.
- `ادوات تكامل حسي`: steps-edu-tools.com, spama.sa, haraj.com.sa, saudimedicalstore.com, alwatad.sa.

The store appears for none of these, which is consistent with it not being indexed.

## 5. Product catalog on the landing site

Added 2026-10-13 because the store's SEO settings cannot be edited. The landing site now carries the store's catalog and sends buyers to Salla to pay.

- `/products` is the hub, `/categories/<slug>` lists each of the 17 store categories, and `/products/<arabic-slug>-p<id>` is one page per product (304 pages).
- Each product page shows the store price and availability, the description, and a buy button that opens the product on `madmakvision.com` with `utm_source=madmakvi.com`, so referrals are measurable.
- Product pages carry `Product` + `Offer` structured data with the SAR price and stock status. Category pages carry `ItemList`.
- Data comes from the store's public storefront API (`lib/store-api.mjs`). Builds use the committed snapshot `lib/store-catalog.snapshot.json`; deployed pages re-read prices and stock from the store every 6 hours.
- Run `pnpm sync:store` and commit the result after adding products or editing descriptions in Salla. New products appear on their own within 6 hours, but with a plain description until the snapshot is refreshed.
- This reverses the keyword split in section 4 for product and buying queries: those now target the pages on this site. If the store's own SEO is ever fixed, choose one site per product to avoid two copies competing.
- 27 products have no description in the store, so their pages are thin. Add descriptions in Salla, then run the sync.

## 6. Off-site checklist

**Search Console and Bing Webmaster Tools**

- [x] `madmakvi.com` verified in Google Search Console as a domain property (DNS TXT added on Hostinger, 2026-10-12). No Vercel env var is needed for Google.
- [x] `https://madmakvi.com/sitemap.xml` submitted in Search Console.
- [ ] `https://madmakvision.com` is added in Search Console but not verified. Paste this tag into Salla's Search Console / custom head-tag setting, then press Verify: `<meta name="google-site-verification" content="XPaf41mPRfum2kDx_CtJDeQwtBiH1SN346GkW_-ZMpk" />`
- [ ] Bing Webmaster Tools: the `madmakvi.com` zone already holds a Bing verification CNAME from an earlier setup. Sign in with that account, confirm the site is listed, submit the sitemap, and add `madmakvision.com`.
- [ ] Submit the store sitemap once Salla serves it.
- [ ] Request indexing: store home, the 17 category URLs, the 15 products in section 3, and the 8 landing pages.

**Google Business Profile**

- [ ] Create or claim "مدماك فيجن", Riyadh, Ishbiliya. Primary category: Medical supply store. Secondary: Physiotherapy equipment supplier.
- [ ] Phone `+966570780836`, website `https://madmakvision.com`, opening hours, photos of products and completed installations.
- [ ] Add products with links to the store categories. Ask customers for reviews after each delivery.

**Consistency and listings**

- [ ] Same name, address and phone everywhere: مدماك فيجن / Madmak Vision, الرياض حي إشبيليا, `+966570780836`, `contact@madmakvision.com`.
- [ ] Listings: Maroof (if eligible), Saudi Yellow Pages, medical supplier directories. The commercial registration number shown by the store is `7053135211`.
- [ ] Put both links in every social bio: TikTok `@madmak_vi`, Instagram and X `@madmakvi`, Snapchat `madmak_vi`.

**Content plan** (publish on the landing site, which already ranks for setup terms; link each article to the matching store category)

1. كيف تجهز مركز علاج طبيعي: الغرف والأجهزة والتكلفة → `/physiotherapy-center-setup`
2. أفضل جهاز تنس للاستخدام المنزلي وكيف تختاره → store TENS products
3. اشتراطات مراكز الرعاية النهارية وقائمة التجهيز → `/daycare-center-setup`
4. مكونات غرفة التكامل الحسي وتكلفتها → `/sensory-room-setup`
5. الفرق بين الليزر والموجات التصادمية في العلاج الطبيعي → `/electrotherapy-room-setup`
6. كيف تختار طاولة العلاج الطبيعي المناسبة لعيادتك → store tables category
