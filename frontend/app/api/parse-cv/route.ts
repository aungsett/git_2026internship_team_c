import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/applicant/parse-cv`;
    console.log("Calling:", url);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/applicant/parse-cv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("Flask response status:", response.status);
    console.log("Flask response body:", text);

    try {
        const data = JSON.parse(text);
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ success: false, error: text }, { status: 500 });
    }
}