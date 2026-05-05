import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PAYAPP_API_URL = "https://api.payapp.kr/oapi/apiLoad.html";
const PRICE = 13900;

export async function POST(req: Request) {
  try {
    const { paymentId, phone, analysisType } = await req.json();

    if (!paymentId || !phone) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      );
    }

    // 이미 결제됐는지 확인
    const { data: existing } = await supabaseAdmin
      .from("love_payments")
      .select("status")
      .eq("payment_id", paymentId)
      .single();

    if (existing?.status === "paid") {
      return NextResponse.json({ error: "이미 결제가 완료되었습니다." }, { status: 400 });
    }

    // 콜백 URL 구성
    const siteUrl = (
      process.env.NEXT_PUBLIC_APP_URL || ""
    ).replace(/\/+$/, "");

    const goodname = analysisType === "solo-escape"
      ? "이쪽 사주 - 솔로 탈출 시기"
      : "이쪽 사주 - 남은 연애 횟수";

    // PayApp API 호출
    const params = new URLSearchParams({
      cmd: "payrequest",
      userid: process.env.PAYAPP_USERID!.trim(),
      linkkey: process.env.PAYAPP_LINKKEY!.trim(),
      linkval: process.env.PAYAPP_LINKVAL!.trim(),
      goodname,
      price: String(PRICE),
      recvphone: phone.replace(/-/g, ""),
      feedbackurl: `${siteUrl}/api/payment/feedback`,
      returnurl: `${siteUrl}/api/payment/return`,
      var1: paymentId,
      var2: analysisType || "love-count",
      smsuse: "n",
      skip_cstpage: "y",
      checkretry: "y",
    });

    const res = await fetch(PAYAPP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const responseText = await res.text();
    const result = Object.fromEntries(new URLSearchParams(responseText));

    if (result.state !== "1") {
      console.error("[payment/create] PayApp error:", result);
      return NextResponse.json(
        { error: result.errorMessage || "결제 요청 실패" },
        { status: 500 },
      );
    }

    // DB 저장
    await supabaseAdmin.from("love_payments").upsert({
      payment_id: paymentId,
      provider_transaction_id: result.mul_no,
      amount: PRICE,
      status: "requested",
      buyer_phone: phone.replace(/-/g, ""),
      analysis_type: analysisType || "love-count",
    });

    return NextResponse.json({
      payurl: result.payurl,
      mul_no: result.mul_no,
    });
  } catch (error) {
    console.error("[payment/create] Error:", error);
    return NextResponse.json({ error: "결제 요청 중 오류가 발생했습니다." }, { status: 500 });
  }
}
