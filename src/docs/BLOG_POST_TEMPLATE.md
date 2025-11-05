# Blog Post Creation Template

## Use this template when creating new blog posts for the SEO strategy

---

## SEO Metadata

**SEO Title:** [60 characters max - Include primary keyword]

**Meta Description:** [160 characters max - Include primary keyword + benefit/hook]

**Canonical URL:** [Full URL]

**Primary Keyword:** [Main target keyword]

**Secondary Keywords:** [List 3-5 related keywords]

**Target Word Count:** [1,500 - 2,000 words]

**Target Audience Segment:** [Segment A or B - see targetAudience.ts]

**Keyword Cluster:** [From keywordClusters.ts]

---

## Content Structure

### H1: [Main Heading - Include Primary Keyword]

**Opening Hook (150-200 words)**
- Start with pain point or compelling question
- Establish relatability with target audience
- Preview the value/solution the post provides

---

### H2: [First Major Section]

**Content Guidelines:**
- 300-400 words per H2 section
- Include 2-3 H3 subsections if needed
- Use bullet points and numbered lists
- Add internal links to related content
- Include relevant examples or scenarios

#### H3: [Subsection if needed]

---

### H2: [Legal/Disclaimer Section - REQUIRED for CPN/Tradeline Content]

Include appropriate disclaimer from `contentStrategy.ts`:
- cpnGeneral (for CPN-focused content)
- tradelines (for tradeline-focused content)
- results (when discussing outcomes/timelines)

---

### H2: [FAQ Section - RECOMMENDED]

Use H3 for each question (natural language, question-based keywords):

#### H3: [Question keyword 1]?
[Clear, direct answer in 100-150 words]

#### H3: [Question keyword 2]?
[Clear, direct answer in 100-150 words]

---

### H2: [Final Value Section/Summary]

**Before CTA - Reinforce Value:**
- Summarize key takeaways
- Restate main benefit
- Transition to action

---

## Call-to-Action Placement

**Inline CTA (Mid-Article):**
```
[Soft or Medium CTA from ctaTemplates - see contentStrategy.ts]
```

**End CTA (Required):**
```
[Hard CTA from ctaTemplates - styled with brand color]
Example: 
"Ready for a Financial Fresh Start? Click Here to Explore Our CPN & Tradeline Packages and Start Your Journey to a 700+ Score Today!"
```

---

## Internal Linking Checklist

- [ ] Link to pillar page if this is cluster content
- [ ] Link to 2-3 related blog posts
- [ ] Link to at least 1 service page (/cpn-packages or /tradeline-marketplace)
- [ ] Use keyword-rich anchor text
- [ ] Open external links in new tab

**Internal Links to Include:**
1. [Anchor Text] → [URL]
2. [Anchor Text] → [URL]
3. [Anchor Text] → [URL]

---

## E-E-A-T Optimization Checklist

**Experience:**
- [ ] Include specific examples or scenarios
- [ ] Reference real-world outcomes (anonymized)
- [ ] Demonstrate nuanced understanding

**Expertise:**
- [ ] Cover topic comprehensively
- [ ] Use industry terminology correctly
- [ ] Anticipate follow-up questions

**Authoritativeness:**
- [ ] Use confident, knowledgeable tone
- [ ] Cite relevant laws/regulations
- [ ] Position as definitive guide

**Trustworthiness:**
- [ ] Include legal disclaimer
- [ ] Be transparent about risks/limitations
- [ ] Avoid unrealistic promises
- [ ] Professional, non-sensational tone

---

## Technical SEO Checklist

**Image Optimization:**
- [ ] All images have descriptive alt text with keywords
- [ ] Images compressed/optimized (WebP preferred)
- [ ] Lazy loading enabled for below-fold images

**Readability:**
- [ ] Paragraphs under 4 lines
- [ ] Subheadings every 300 words
- [ ] Bullet points and lists used
- [ ] Sentence variety (short and long)

**Schema Markup:**
- [ ] Article schema added (see schemaMarkup.ts)
- [ ] FAQ schema if FAQ section included
- [ ] Breadcrumb schema

**Mobile Optimization:**
- [ ] Test on mobile devices
- [ ] Ensure proper text sizing
- [ ] Check tap target sizes for CTAs

---

## Keyword Usage Guidelines

**Natural Integration - DO:**
✅ Use primary keyword in H1
✅ Use in first 100 words
✅ Use in at least one H2
✅ Use in meta description
✅ Use in conclusion
✅ Use variations and synonyms throughout

**Keyword Stuffing - DON'T:**
❌ Force repetition
❌ Use keyword density formulas
❌ Sacrifice readability for keywords
❌ Create awkward phrasing

**Target Density:** 1-2% of primary keyword (appears naturally 15-20 times in 1,500-word post)

---

## Final Review Checklist

Content Quality:
- [ ] Flows naturally and logically
- [ ] Provides unique value
- [ ] Answers target keyword intent completely
- [ ] Appropriate for target audience segment

SEO Technical:
- [ ] SEO title optimized
- [ ] Meta description compelling
- [ ] URL slug includes keyword
- [ ] Canonical tag set
- [ ] Image alt text added
- [ ] Internal links added (min 3)
- [ ] Schema markup added

Compliance:
- [ ] Legal disclaimer included
- [ ] No false promises
- [ ] Transparent about risks
- [ ] Professional tone maintained

Conversion:
- [ ] At least 2 CTAs included
- [ ] CTAs contextually placed
- [ ] Clear next steps provided
- [ ] Links to service pages

---

## Publishing Checklist

- [ ] Add to blogPosts data array
- [ ] Set featured image
- [ ] Set publish date
- [ ] Add appropriate tags
- [ ] Set featured status if pillar content
- [ ] Update sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Share on social media
- [ ] Add to email newsletter

---

## Performance Tracking

**Metrics to Monitor:**
- Organic traffic to post
- Average time on page
- Bounce rate
- Keyword rankings (primary + secondary)
- CTA click-through rate
- Conversion rate (from post to service page)

**Tools:**
- Google Analytics 4
- Google Search Console
- Ahrefs/SEMrush for keyword tracking

---

## Notes

[Add any specific notes, research sources, or special considerations for this post]
