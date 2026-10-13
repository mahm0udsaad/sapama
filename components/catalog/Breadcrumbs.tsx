export type Crumb = { name: string; path: string }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs = [{ name: "الرئيسية", path: "/" }, ...items]

  return (
    <nav aria-label="مسار التنقل" className="text-sm text-muted-foreground mb-8">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-foreground font-medium">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <a href={crumb.path} className="hover:text-primary transition">
                    {crumb.name}
                  </a>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
