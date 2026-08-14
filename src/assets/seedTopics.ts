// scripts/seedTopics.ts
import { db } from "@/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const topics = [
   {
    id: "crm-best-practices-lesson-1",
    topicId: "crm-best-practices",
    lessonNumber: 1,
    title: "What are CRM Best Practices?",
    overview:
      "CRM best practices are simple, proven habits that help a business get real value from its CRM system. Instead of just storing customer data, a CRM becomes useful only when that data is clean, sales steps are followed the same way every time, and employees actually use the system daily. Following best practices means fewer mistakes, better reports, and a sales team that trusts the information in front of them. Think of it like keeping a shared notebook updated and organized so that anyone on the team can open it and immediately understand what's happening with a customer.",
    example: {
      title: "CRM Best Practices",
      content:
        "CRM Strategy\n     ↓\nClean Data\n     ↓\nConsistent Processes\n     ↓\nUser Adoption\n     ↓\nBetter CRM Results"
    }
  },

  {
    id: "crm-best-practices-lesson-2",
    topicId: "crm-best-practices",
    lessonNumber: 2,
    title: "Maintaining Data Quality",
    overview:
      "Data quality means the information stored in your CRM is accurate, complete, and up to date. Imagine having three different entries for the same customer, each with a slightly different phone number — nobody knows which one is correct. This happens when data isn't checked regularly. Good data quality involves removing duplicate records, filling in missing details like email or phone number, correcting typos, and updating information when a customer's details change (like a new job title or company). Clean data means your sales team spends less time guessing and more time actually selling.",
    example: {
      title: "Data Quality",
      content:
        "Customer Data\n      ↓\nCheck Accuracy\n      ↓\nRemove Duplicates\n      ↓\nUpdate Old Records\n      ↓\nClean CRM Data"
    }
  },

  {
    id: "crm-best-practices-lesson-3",
    topicId: "crm-best-practices",
    lessonNumber: 3,
    title: "Standardizing Sales Processes",
    overview:
      "A standardized sales process means every salesperson follows the same basic steps when working with a customer, instead of everyone doing their own thing. For example, a new contact always starts as a 'Lead,' gets 'Qualified' to check if they're a good fit, becomes an 'Opportunity' once there's real interest, receives a 'Proposal,' and finally reaches 'Close' when the deal is won or lost. This consistency makes it much easier for managers to see where every deal stands, and it helps new team members learn the sales process quickly by following the same clear path everyone else uses.",
    example: {
      title: "Standard Sales Process",
      content:
        "Lead\n  ↓\nQualify\n  ↓\nOpportunity\n  ↓\nProposal\n  ↓\nClose"
    }
  },

  {
    id: "crm-best-practices-lesson-4",
    topicId: "crm-best-practices",
    lessonNumber: 4,
    title: "Managing CRM Security",
    overview:
      "CRM security is about controlling who can see and edit what information. Not every employee needs access to everything — for example, a junior sales rep probably doesn't need to see company-wide financial reports, while a sales manager might. The general rule is to give each person only the access required for their specific job, known as the 'principle of least privilege.' This protects sensitive customer information, reduces the risk of accidental changes or deletions, and keeps the business compliant with data protection expectations, especially when handling personal customer details.",
    example: {
      title: "Security Practice",
      content:
        "User Role\n    ↓\nRequired Permissions\n    ↓\nControlled Access\n    ↓\nProtected CRM Data"
    }
  },

  {
    id: "crm-best-practices-lesson-5",
    topicId: "crm-best-practices",
    lessonNumber: 5,
    title: "User Adoption and Training",
    overview:
      "Even the best CRM system fails if employees don't understand how to use it or don't see why it matters. User adoption means making sure every team member is properly trained, understands the sales process, and knows how to correctly enter and update information. Without training, people either avoid using the CRM altogether or enter data incorrectly, which hurts data quality down the line. Good onboarding, simple documentation, and ongoing support all help build habits where using the CRM feels natural rather than like extra work.",
    example: {
      title: "User Adoption",
      content:
        "CRM Training\n     ↓\nUnderstand Processes\n     ↓\nUse CRM Correctly\n     ↓\nBetter Data\n     ↓\nBetter Results"
    }
  },

  {
    id: "crm-best-practices-lesson-6",
    topicId: "crm-best-practices",
    lessonNumber: 6,
    title: "Reviewing CRM Performance",
    overview:
      "A CRM system isn't something you set up once and forget about — it needs regular check-ins. Reviewing CRM performance means periodically looking at how the data is being used: Are records still accurate? Are sales reps following the process? Are reports giving useful insights? Are users complaining about anything being confusing or slow? Gathering feedback from the people using the CRM daily, combined with reviewing reports and data quality, helps identify problems early and make small improvements over time, keeping the system genuinely useful instead of becoming outdated or ignored.",
    example: {
      title: "CRM Review",
      content:
        "CRM Usage\n    ↓\nReview Data\n    ↓\nAnalyze Performance\n    ↓\nIdentify Issues\n    ↓\nImprove CRM"
    }
  }
];

export async function seedTopics() {
    for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        const topicRef = doc(db, "lessons", topic.id);

        await setDoc(
            topicRef,
            {
                ...topic,
                // categoryId: "crm", // 👈 don't forget this, matches your category doc
                // order: i + 1,       // 👈 sequential order based on array position
            },
            { merge: true },
        );

        console.log(`Seeded ${topic.id} → order: ${i + 1}`);
    }
    console.log("✅ Topics done!");
}
