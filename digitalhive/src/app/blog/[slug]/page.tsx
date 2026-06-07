import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ArticleContent } from "@/components/article-content";
import { ShareButtons } from "@/components/share-buttons";
import { ArticleJsonLd } from "@/components/structured-data";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import {
  blogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
} from "@/lib/data/blog";
import { formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Article not found" });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    keywords: post.tags,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);

  return (
    <>
      <article className="container-page py-10">
        <ArticleJsonLd post={post} />
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <Badge variant="accent">{post.category}</Badge>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y py-4">
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div className="text-sm">
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-muted-foreground">
                  {formatDate(post.publishedAt)} · {post.readingMinutes} min read
                </div>
              </div>
            </div>
            <ShareButtons slug={post.slug} title={post.title} />
          </div>
        </div>

        <div className="relative mx-auto my-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <div className="mx-auto max-w-3xl">
          <ArticleContent content={post.content} />

          {/* Author bio */}
          <div className="mt-12 flex items-start gap-4 rounded-xl border bg-secondary/40 p-6">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-semibold text-primary">
                {post.author.role}
              </div>
              <div className="text-lg font-bold">{post.author.name}</div>
              <p className="mt-1 text-sm text-muted-foreground">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mx-auto mt-16 max-w-5xl border-t pt-12">
          <SectionHeading title="Related Articles" href="/blog" />
          <div className="grid gap-8 sm:grid-cols-3">
            {related.map((rp) => (
              <article key={rp.slug} className="group flex flex-col">
                <Link
                  href={`/blog/${rp.slug}`}
                  className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl border"
                >
                  <Image
                    src={rp.coverImage}
                    alt={rp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <Badge variant="secondary" className="w-fit">
                  {rp.category}
                </Badge>
                <h3 className="mt-2 font-semibold leading-snug">
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="hover:text-primary"
                  >
                    {rp.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      </article>
      <CtaBanner />
    </>
  );
}
