import FolderView from "@/components/FolderView";

type FolderPageProps = {
  params: Promise<{ folderId: string }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;

  return <FolderView folderId={folderId} />;
}
