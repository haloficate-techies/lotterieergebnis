"use client";

import { useId, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="faqList">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-question-${index}`;
        const panelId = `${baseId}-answer-${index}`;

        return (
          <article key={item.question} className={`faqItem${isOpen ? " isOpen" : ""}`}>
            <h3 className="faqQuestionHeading">
              <button
                id={buttonId}
                type="button"
                className="faqTrigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="faqQuestion">{item.question}</span>
                <span className="faqToggleIcon" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              className="faqAnswerRegion"
              role="region"
              aria-labelledby={buttonId}
            >
              <div className="faqAnswerInner">
                <p className="faqAnswer">{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
