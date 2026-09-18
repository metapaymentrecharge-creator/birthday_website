import { supabase } from "@/supabase";
import { notFound } from "next/navigation";
import WishViewer from "./WishViewer";

export default async function WishPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data, error } = await supabase
    .from("birthday_wishes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return <WishViewer data={data} />;
}