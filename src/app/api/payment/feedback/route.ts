import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const payState = params.get("pay_state");
    const paymentId = params.get("var1");

    if (!paymentId) {
      return new Response("FAIL", { status: 200 });
    }

    let paymentStatus: string;
    switch (payState) {
      case "4":
        paymentStatus = "paid";
        break;
      case "8":
      case "32":
        paymentStatus = "cancelled";
        break;
      case "9":
      case "64":
        paymentStatus = "refunded";
        break;
      default:
        return new Response("SUCCESS", { status: 200 });
    }

    await supabaseAdmin
      .from("love_payments")
      .update({ status: paymentStatus, updated_at: new Date().toISOString() })
      .eq("payment_id", paymentId);

    return new Response("SUCCESS", { status: 200 });
  } catch (error) {
    console.error("[payment/feedback] Error:", error);
    return new Response("FAIL", { status: 200 });
  }
}
