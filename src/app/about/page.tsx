import StoryExperience from "./StoryExperience";
import "./story.css";
import { getSite } from "@/lib/site";

export const metadata = {
  title: "Our Story",
  description: "Meet Esstofa Stove Works, a Kisumu-based supplier, retailer and installer of cooking solutions serving customers across Kenya and Africa.",
};
export const dynamic = "force-dynamic";

export default async function About() {
  const site = await getSite();

  return (
    <StoryExperience
      businessName={site.businessName}
      story={site.story}
      mission={site.mission}
      vision={site.vision}
      foundedNote={site.foundedNote}
      location={site.location}
      phone1={site.phone1}
      phone2={site.phone2}
      email={site.email}
      tiktokUrl={site.tiktokUrl}
      hours={site.hours}
    />
  );
}
