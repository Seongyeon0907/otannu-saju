import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("id");

  if (!paymentId) {
    return NextResponse.json({ error: "paymentId 필요" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("love_payments")
    .select("status")
    .eq("payment_id", paymentId)
    .single();

  if (error || !data) {
    return NextResponse.json({ status: "not_found" });
  }

  return NextResponse.json({ status: data.status });
}
