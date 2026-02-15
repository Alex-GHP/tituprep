import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/dashboard";

	const forwardedHost = request.headers.get("x-forwarded-host");
	const isLocal = process.env.NODE_ENV === "development";
	let redirectOrigin = origin;
	if (!isLocal && forwardedHost) {
		redirectOrigin = `https://${forwardedHost}`;
	}

	if (code) {
		const redirectResponse = NextResponse.redirect(`${redirectOrigin}${next}`);

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

	return NextResponse.redirect(`${redirectOrigin}/?error=auth_failed`);
}
