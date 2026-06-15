interface FAQEntry {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
}

interface SeoSchemaProps {
  faqItems?: FAQEntry[];
  howToName?: string;
  howToSteps?: HowToStep[];
}

export default function SeoSchema({ faqItems, howToName, howToSteps }: SeoSchemaProps) {
  const schemas: object[] = [];

  if (faqItems && faqItems.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  if (howToName && howToSteps && howToSteps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howToName,
      step: howToSteps.map((s) => ({
        '@type': 'HowToStep',
        name: s.name,
        text: s.text,
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
