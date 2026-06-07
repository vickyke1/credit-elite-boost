import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/data/blog";
import { formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Tips, guides, and strategies for selling digital products, growing on Etsy, SEO, and building a creator business — from the DigitalHive blog.",
  path: "/blog",
});

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          The DigitalHive Blog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Guides and strategies to help you find great products and grow a
          thriving digital business.
        </p>
      </div>

      {/* Featured post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group mb-12 grid gap-6 overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-2"
      >
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
          <Image
            src={featured.coverImage}
            alt={featured.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          <Badge variant="accent" className="w-fit">
            {featured.category}
          </Badge>
          <h2 className="mt-3 text-2xl font-bold leading-tight group-hover:text-primary">
            {featured.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
          <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
            <Image
              src={featured.author.avatar}
              alt={featured.author.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span>{featured.author.name}</span>
            <span>·</span>
            <span>{formatDate(featured.publishedAt)}</span>
            <span>·</span>
            <span>{featured.readingMinutes} min read</span>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <article key={post.slug} className="group flex flex-col">
            <Link
              href={`/blog/${post.slug}`}
              className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <Badge variant="secondary" className="w-fit">
              {post.category}
            </Badge>
            <h3 className="mt-2 text-lg font-semibold leading-snug">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                {post.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-3 text-xs text-muted-foreground">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min read
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
