// services/financialData.ts
import { FactTopic } from '../types';

export const financialKnowledgeBase = {
  [FactTopic.Fraud]: {
    source: "Internal Security Division - Fraud Prevention Guide",
    content: `
**Staying One Step Ahead of Scammers:** Here’s a breakdown of common financial frauds I advise my clients to watch out for in India. The key is vigilance.
1.  **Phishing Scams:** Think of these as digital tricksters impersonating your bank or a trusted company via email or SMS. Their goal? To steal your login credentials. **My advice:** Never click on suspicious links. If you get an urgent message, close it and log in directly through the official app or website.
2.  **UPI Frauds:** This is a big one. Scammers might send you a fake payment request or trick you into using a screen-sharing app to see your PIN. **The golden rule:** You NEVER need to enter your PIN to *receive* money. Reject any unknown requests, and never share your UPI PIN or OTP.
3.  **Loan App Frauds:** Unregulated apps offer instant loans at high interest rates and then harass borrowers. **My advice:** Only use RBI-approved loan apps. Check reviews and permissions before installing.
4.  **Job Offer Scams:** Be wary of fake companies asking for a "registration fee" for a guaranteed job. Legitimate companies never ask for money to schedule an interview or offer a job.
**Fake News Section:** Watch out for "guaranteed high return" investment schemes on social media. If it sounds too good to be true, it probably is. Verify any investment opportunity with a registered financial advisor.`,
  },
  [FactTopic.Savings]: {
    source: "Indian Tax & Savings Policy Guide (2024)",
    content: `
**Smart Savings & Tax Strategies for Indians:** Let's talk about making your money work harder for you. Choosing the right savings instruments is crucial for both wealth creation and tax efficiency.
*   **For Salaried Individuals:** Here are the workhorses of a solid savings plan:
    *   **EPF (Employee Provident Fund):** This is your mandatory retirement savings. It's a fantastic 'set it and forget it' tool with tax-free growth.
    *   **PPF (Public Provident Fund):** A versatile 15-year scheme that's a favorite for its tax-free status (EEE). You can invest up to ₹1.5 lakh per year. It's a cornerstone for long-term goals.
    *   **NPS (National Pension System):** Offers an additional tax deduction of ₹50,000 under Section 80CCD(1B), over and above the 80C limit. Excellent for retirement planning.
    *   **Tax Saver FDs:** 5-year fixed deposits that offer tax deductions under Section 80C, suitable for conservative investors.
*   **The Big Question: New vs. Old Tax Regime?** This is a common dilemma. The **New Regime** is simple, with lower tax rates but no deductions. The **Old Regime** has higher rates but lets you claim deductions (like 80C for PPF, insurance, etc.). **My recommendation:** If you're already a disciplined investor utilizing the full ₹1.5 lakh 80C limit and have a home loan, the Old Regime often saves you more tax. For those who prefer simplicity or have fewer investments, the New Regime can be better. It's always best to run the numbers for your specific situation.`,
  },
  [FactTopic.Taxes]: {
    source: "Indian Tax Policy Guide (2024)",
    content: `
**Decoding Indian Tax Policy:** Taxes can feel complicated, but let's break it down. To give you the best advice, I need to know what you're trying to solve. Are you looking to file your ITR, understand TDS, or figure out the old vs. new tax regime puzzle?
*   **New Tax Policy Explained:** The government introduced this as the default option to simplify taxes. It offers lower slab rates but, in return, you give up most of the popular deductions (like Section 80C, 80D for medical insurance, HRA, etc.).
*   **How to Save Tax in the New Regime?** It's a different mindset. Instead of focusing on deductions, you focus on tax-efficient growth. Instruments like ELSS (Equity Linked Savings Schemes) can still be attractive for their growth potential, even without the 80C benefit, as long-term capital gains have favorable tax treatment.`,
  },
  [FactTopic.Budgeting]: {
    source: "Personal Finance Best Practices",
    content: `
**Mastering Your Money: Practical Budgeting:** A budget isn't about restriction; it's about empowerment. It's a plan that tells your money where to go.
*   **A Proven Framework: The 50/30/20 Rule:** I recommend this to most clients starting out. It's simple and effective:
    *   **50% for Needs:** This covers your absolute essentials: rent/EMI, groceries, utilities, transport.
    *   **30% for Wants:** Life's pleasures: dining out, entertainment, hobbies.
    *   **20% for Your Future Self:** This is non-negotiable. It goes towards savings, investments, and clearing high-interest debt.
*   **Your Action Plan:**
    1.  **Become a Detective:** For one month, track every single rupee. Use an app or a simple notebook. This isn't about judgment; it's about data.
    2.  **Create Your Blueprint:** Use your tracked spending and the 50/30/20 rule to create your first budget.
    3.  **Pay Yourself First (Automate it!):** This is the most powerful financial habit. Set up automatic transfers to your savings and investment accounts the day you get paid.
*   **Let's Get Specific:** What's your biggest budgeting challenge right now? Are you dealing with debt, or are you unsure where to invest your savings? Tell me more so I can offer tailored advice.`,
  },
};