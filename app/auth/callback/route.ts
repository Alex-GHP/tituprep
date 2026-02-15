import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get("code");
	const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";

	if (code) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = next;
		redirectUrl.searchParams.delete("code");
		redirectUrl.searchParams.delete("next");

		const redirectResponse = NextResponse.redirect(redirectUrl);

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
			{
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet) {
						for (const { name, value, options } of cookiesToSet) {
							redirectResponse.cookies.set(name, value, options);
						}
					},
				},
			},
		);

		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return redirectResponse;
		}
	}

	// If something went wrong, redirect back to landing with error
	const errorUrl = request.nextUrl.clone();
	errorUrl.pathname = "/";
	errorUrl.searchParams.delete("code");
	errorUrl.searchParams.delete("next");
	errorUrl.searchParams.set("error", "auth_failed");
	return NextResponse.redirect(errorUrl);
}
