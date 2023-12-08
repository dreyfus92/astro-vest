import type { APIContext, APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }: APIContext) => {
    const reqBody = await request.json();

    console.log(reqBody)
    // Handle reqBody to write messages in DB or something
    if (reqBody.name && reqBody.email && reqBody.message) {
        //Redirect to thank you page
        return redirect('/thank-you', 302)
    }

    return new Response("Something went wrong", { status: 400 })
};

