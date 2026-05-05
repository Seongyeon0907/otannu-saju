import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/+$/, "");
}

// skip_cstpage=y → PayApp이 POST로 호출
export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const paymentId = params.get("var1") || "";

  if (paymentId) {
    await supabaseAdmin
      .from("love_payments")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("payment_id", paymentId);
  }

  return NextResponse.redirect(`${getSiteUrl()}/love/result?paid=true`, 303);
}

// 매출전표 확인 버튼 → GET
export async function GET(req: Request) {
  const url = new URL(req.url);
  const paymentId = url.searchParams.get("var1") || "";

  if (paymentId) {
    await supabaseAdmin
      .from("love_payments")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("payment_id", paymentId);
  }

  return NextResponse.redirect(`${getSiteUrl()}/love/result?paid=true`, 303);
}
