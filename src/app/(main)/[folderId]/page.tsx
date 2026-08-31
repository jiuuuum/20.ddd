import type { Metadata } from "next";
import { cookies } from "next/headers";
import FolderView from "@/components/FolderView";
import { createClient } from "@/utils/supabase/server";

type FolderPageProps = {
  params: Promise<{ folderId: string }>;
};

export async function generateMetadata({
  params,
}: FolderPageProps): Promise<Metadata> {
  const { folderId } = await params;
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("folders")
    .select("name")
    .eq("id", Number(folderId))
    .single();

  return { title: data?.name ?? "폴더" };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;

  return <FolderView folderId={folderId} />;
}
