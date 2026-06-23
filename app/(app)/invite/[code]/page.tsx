import { InviteAcceptView } from "@/components/trainees/InviteAcceptView";

type InvitePageProps = {
  params: Promise<{ code: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;
  return <InviteAcceptView code={code} />;
}
