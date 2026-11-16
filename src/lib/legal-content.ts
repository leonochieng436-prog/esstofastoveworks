export const LEGAL_POLICY_SLUGS = [
  "privacy-policy",
  "cookie-policy",
  "terms-and-conditions",
] as const;

export type LegalPolicySlug = (typeof LEGAL_POLICY_SLUGS)[number];

export type CookieCategoryKey = "essential" | "functional" | "analytics" | "marketing";

export type CookieCategoryConfig = {
  key: CookieCategoryKey;
  title: string;
  description: string;
  essential: boolean;
  enabled: boolean;
};

export const DEFAULT_COOKIE_CATEGORIES: CookieCategoryConfig[] = [
  {
    key: "essential",
    title: "Essential",
    description: "Required for security and administrator sign-in. These settings cannot be turned off.",
    essential: true,
    enabled: true,
  },
  {
    key: "functional",
    title: "Functional",
    description: "Remember optional preferences that make the website more convenient.",
    essential: false,
    enabled: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Help measure website use and performance.",
    essential: false,
    enabled: true,
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Support advertising or marketing measurement.",
    essential: false,
    enabled: true,
  },
];

export const LEGAL_POLICY_DEFAULTS: Record<LegalPolicySlug, { title: string; content: string }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    content: `## 1. About this policy
This Privacy Policy explains how Esstofa Stove Works handles personal information when you browse this website, contact us, ask for a quotation, or request a booking. We aim to handle information lawfully, fairly, transparently, and only for purposes connected with our business.

This policy is intended to be read with the Terms and Conditions and Cookie Policy. It is not legal advice. Esstofa Stove Works should have this policy reviewed by a qualified Kenyan legal professional and confirm its production hosting, retention, and vendor arrangements before publication.

## 2. Who is responsible for your information
Esstofa Stove Works is the business responsible for the information submitted through this website. The business is based in Kisumu, Kenya. The application does not state a company registration number, a street address, or a data-protection registration status, so none is represented here.

For privacy requests or questions, contact Reaganomondi2022@gmail.com or call 0745017194 or 0727877452.

## 3. Information we collect
Depending on the request, we may receive:
- Contact and location details, including your name, phone number, optional email address, county, town, and service location.
- Booking details, including the requested service, preferred date and time, service method, project description, and additional notes.
- Quotation and product enquiry details, including questionnaire answers, the product or service you ask about, and your message or project specifications.
- Files you choose to upload, such as project photographs or supporting documents. The website currently accepts up to five files per upload, with a five-megabyte limit per file.
- Information needed to check an existing booking, such as its reference and the phone number used for the request.
- Administrator account details, including name and email address, and a password hash used to protect administrator access.
- Technical information that may be processed by the hosting or network services used to deliver the website, such as IP address, browser, device, and connection information.

The website's application code does not currently include an analytics or advertising tracking service.

## 4. How we use information
We use submitted information to respond to questions, prepare and discuss quotations, review booking requests, plan consultations or site visits, provide products and services, communicate about a request, and keep records of work agreed with you. A booking form submission is a request and is not a confirmed appointment until Esstofa contacts you to confirm.

We may also use information to secure the website, prevent spam or misuse, administer staff access, resolve complaints, and meet legal obligations. We do not use a mandatory legal acknowledgement as permission for marketing. If marketing communications are introduced, they require a separate, optional choice.

## 5. Legal grounds
Depending on the circumstances, processing may be necessary to take steps you request before an agreement, perform an agreement, meet a legal obligation, protect the website and business through legitimate interests, or act on consent where consent is required. You may withdraw consent for consent-based processing; withdrawal does not affect processing already carried out lawfully.

## 6. Sharing and service providers
Access is limited to Esstofa personnel who need information to handle a request or administer the website. The website uses a PostgreSQL database configured by the deployment. If the relevant services are configured, uploaded files are sent to Cloudinary and email notifications are sent through Resend. The hosting, database, file, and email providers may process information to provide their services and under their own terms.

We do not sell personal information. We may disclose information where required by law, to protect rights and safety, or as part of a business or legal process where permitted by law. We do not control the independent privacy practices of third-party providers.

## 7. Storage, security, and international transfers
Booking, quotation, and enquiry records are stored in the website database. Uploaded files may be stored by Cloudinary if uploads are configured. Administrator passwords are stored as password hashes, and the website restricts administrative access to authenticated accounts. The administrator session uses an HttpOnly, SameSite=Lax cookie with a 12-hour lifetime; production cookies are marked Secure.

We use reasonable administrative and technical safeguards, but no internet transmission or storage system can be guaranteed completely secure. The application does not define the hosting provider's storage region, backup schedule, or all provider retention periods; those details depend on the production deployment.

Some hosting or service providers may process data outside Kenya. Where a transfer outside Kenya occurs, Esstofa should use the safeguards or other lawful transfer conditions required by the Data Protection Act, 2019 and applicable regulations. International customers should understand that their information may be processed in the country where a configured service provider operates.

## 8. Retention and deletion
The application does not set a fixed retention period for enquiries, bookings, questionnaires, uploaded files, or email records. Esstofa retains information only for as long as reasonably needed to handle the request, provide services, maintain necessary business records, resolve disputes, and meet legal obligations. A documented retention schedule and the handling of provider backups should be confirmed for the production service.

You may ask us to delete information. We will assess the request, verify it is from the relevant person, and consider applicable legal, contractual, and dispute-related retention requirements. Deletion from active systems may not immediately remove copies held in provider backups.

## 9. Your data-protection rights
Subject to applicable law, you may ask to be informed about use of your data, request access, object to processing, request correction of inaccurate information, or request deletion or erasure where available. You may also exercise other rights provided by Kenyan law. Contact us using the details in this policy; we may ask for information needed to verify your identity and locate the relevant record.

You may complain to the Office of the Data Protection Commissioner in Kenya if you believe your information has been handled unlawfully. The regulator's public guidance is linked below.

## 10. Breaches and changes
If a personal-data breach occurs, Esstofa will investigate, take reasonable steps to contain and remedy it, and notify the Data Protection Commissioner and affected people within applicable legal requirements and timelines.

We may update this policy when our practices or legal obligations change. The latest revision date will be shown on this page. Material changes should be communicated through the website or another appropriate channel.

## 11. Contact
Privacy enquiries: Reaganomondi2022@gmail.com

Phone: 0745017194 or 0727877452

Location: Kisumu, Kenya`,
  },
  "cookie-policy": {
    title: "Cookie Policy",
    content: `## 1. What cookies and similar technologies are
Cookies are small text files saved by a website in a browser. Websites may also use similar storage, such as browser local storage, to remember a choice or support a feature.

## 2. What this website currently uses
The website does not currently include analytics or advertising trackers. The administrator sign-in uses an essential first-party cookie named admin_session. It is HttpOnly, uses SameSite=Lax, is marked Secure in production, and expires after 12 hours.

Your cookie choices are saved in this browser's local storage so the website can remember them. That preference record is not sent to Esstofa's database, and the website does not currently collect central cookie-consent statistics.

## 3. Cookie and storage categories
### Essential
Essential storage supports administrator authentication and security and cannot be disabled in the cookie settings. Public browsing and customer forms do not require the administrator session.

### Functional
Functional storage may remember optional settings. No optional functional cookies are currently configured on this website.

### Analytics
No analytics cookies or analytics scripts are currently configured. If this changes, the category will remain off until the visitor gives the required consent.

### Marketing
No marketing or advertising cookies are currently configured. If this changes, the category will remain off until the visitor gives the required consent.

## 4. Third-party services
If Esstofa configures a service video, the video is not loaded until a visitor chooses to open it. The current video embed uses YouTube's privacy-enhanced domain, but playback may still connect to YouTube and be subject to its own data and cookie practices. Cloudinary may receive a request when a hosted project image is displayed, if Cloudinary uploads are configured.

Third-party providers operate under their own privacy and cookie policies. Esstofa does not control cookies or technologies they set.

## 5. Your choices
On a first visit, the cookie notice lets you accept all available optional categories, reject non-essential categories, or customize preferences. Essential storage remains active. Use the Cookie Settings link in the footer at any time to change or withdraw a previous choice.

You can also clear local storage or block cookies through your browser settings. Blocking essential cookies may prevent administrator sign-in from working. Clearing site storage removes the saved consent choice, so the notice may appear again.

## 6. Duration and updates
The administrator session expires after 12 hours. The consent preference remains in this browser's local storage until you change or clear it. Duration for any future third-party cookie depends on that provider and will be described here before the technology is enabled.

This policy should be reviewed whenever new analytics, marketing, or third-party technologies are introduced. Last updated: 16 November 2026.`,
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    content: `## A. Introduction
These Terms and Conditions govern use of the Esstofa Stove Works website and enquiries made through it. By using the website, you agree to these terms to the extent permitted by law. If you do not agree, do not use the website. A separate written quotation or service agreement may include additional terms for a particular project.

## B. Business services
Esstofa Stove Works is a supplier, retailer, and installer of stoves, ovens, grills, boilers, and outdoor kitchen solutions. Services may include fabrication, installation, maintenance, repairs, consultation, and related work that Esstofa has confirmed it can provide. Availability, location, scope, materials, and timing are discussed for each request.

## C. Product information
Product descriptions, photographs, specifications, availability, and prices are provided for general information and may change. Images may be illustrative and actual finish, dimensions, materials, or appearance may vary. Product details marked as a sample listing are not verified product specifications and must not be relied on as a final offer. Ask Esstofa to confirm current details in writing.

## D. Enquiries and quotations
You may submit an enquiry, questionnaire, photographs, documents, or project specifications through the website. You must have the right to provide any uploaded material and should avoid uploading unrelated or sensitive personal information.

Submitting an enquiry or receiving an acknowledgement does not constitute an accepted quotation, an order, or a promise that Esstofa will provide the requested work. A quotation is subject to confirmation of requirements, site conditions, materials, availability, and any written terms included with it.

## E. Bookings and appointments
A booking form creates an appointment request only. It is not a confirmed appointment until Esstofa contacts you and confirms it. Esstofa will discuss availability and any next steps using the contact details provided. To reschedule or cancel, contact Esstofa as soon as reasonably possible. Any confirmed project-specific arrangements take precedence where lawful.

## F. Pricing and payment
Prices, quotation validity periods, deposits, payment methods, balances, and additional charges are not specified as universal terms on this website. They must be confirmed in the quotation, invoice, or other written agreement for the particular project. Do not treat sample catalogue prices or placeholders as an offer.

Nothing in this section limits rights that cannot be limited under applicable consumer-protection law.

## G. Installation, repairs, and safety
The customer must provide accurate information about the equipment, site, fuel, access, and intended use, and must arrange safe and reasonable access to the work area. Site-specific conditions may affect the scope, cost, or timing and will be discussed before additional work is undertaken.

Customers should follow the instructions provided for installed equipment, use suitable fuel, maintain appropriate ventilation, and keep children and others away from active cooking equipment and work areas. Stop using equipment that appears unsafe and contact a qualified service provider. Do not rely on website information as a substitute for a site assessment or professional safety advice.

Any warranty is limited to the terms given in the project-specific written warranty or agreement. This website does not state a warranty period or universal warranty conditions.

## H. Customer responsibilities
You are responsible for providing truthful, current contact details and accurate project information; ensuring you have permission to share photographs and documents; and notifying Esstofa of relevant changes. Do not submit unlawful, misleading, harmful, or third-party confidential material without authorization.

## I. Intellectual property
Unless stated otherwise, the Esstofa name, branding, website text, photographs, product descriptions, and original designs belong to Esstofa Stove Works or its licensors. You may view and use the website for personal, non-commercial enquiry purposes. You may not copy, republish, modify, or commercially exploit protected material without prior permission, except where permitted by law.

## J. Website availability
The website is provided subject to maintenance, updates, network availability, and third-party services. Access may be interrupted or information may be temporarily unavailable. Esstofa will take reasonable steps to restore service but does not guarantee uninterrupted access.

## K. Liability
Website content is general information and is not a substitute for a confirmed quotation, site assessment, or professional advice. To the extent permitted by law, Esstofa is not responsible for loss caused by reliance on incomplete website information or interruption caused by third-party networks or services.

Nothing in these terms excludes or limits liability, consumer rights, or remedies where exclusion or limitation is prohibited by Kenyan law. Project-specific contractual responsibilities are governed by the written agreement and applicable law.

## L. Cancellations, refunds, and adjustments
Contact Esstofa to request cancellation, a refund, rescheduling, or a service adjustment. Any project-specific cancellation charges, refund conditions, or timing must be confirmed in the relevant written agreement; this website does not publish a universal refund period or condition. Mandatory rights and remedies under applicable law remain unaffected.

## M. Privacy and data protection
Information submitted through the website is handled under the Privacy Policy. Cookie and local-storage choices are explained in the Cookie Policy. You can change non-essential cookie choices through Cookie Settings in the footer.

## N. Complaints and disputes
Please first contact Esstofa at Reaganomondi2022@gmail.com or 0745017194 / 0727877452 so the matter can be reviewed. These terms are governed by the laws of Kenya, including applicable consumer-protection requirements under the Consumer Protection Act, 2012 and electronic-transactions requirements under Kenyan law. Mandatory consumer rights and applicable dispute-resolution processes remain unaffected. A customer may contact a competent Kenyan authority or court where appropriate.

## O. Amendments
Esstofa may revise these terms when the website, services, or legal requirements change. The latest revision date will appear on this page. Updated terms apply prospectively from publication and do not remove rights that have already accrued under law or a separate written agreement.

## P. Contact information
Esstofa Stove Works

Kisumu, Kenya

Email: Reaganomondi2022@gmail.com

Phone: 0745017194 or 0727877452

## Legal review
These website terms are a general business document, not legal advice. A qualified Kenyan legal professional should review them before publication, particularly any project-specific payment, cancellation, refund, warranty, and liability terms. Last updated: 16 November 2026.`,
  },
};

export function isLegalPolicySlug(value: string): value is LegalPolicySlug {
  return LEGAL_POLICY_SLUGS.includes(value as LegalPolicySlug);
}
