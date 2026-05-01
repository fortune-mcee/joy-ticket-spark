export const Marquee = () => {
  const items = [
    "Adekunle Gold · Orchestra Show",
    "★",
    "Felabration 2026",
    "★",
    "National Troupe of Nigeria",
    "★",
    "Iganmu Shorts · New Cinema",
    "★",
    "Tiwa Savage · Lucid Dreams",
    "★",
    "After Hours · Jazz at the Banquet Hall",
    "★",
  ];
  const loop = [...items, ...items];

  return (
    <section className="bg-foreground text-background py-6 border-y border-background/10 overflow-hidden">
      <div className="flex w-max marquee whitespace-nowrap">
        {loop.map((t, i) => (
          <span
            key={i}
            className="font-display text-2xl md:text-4xl px-6 italic font-light"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
};
