#!/usr/bin/env node

import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { loadEnvFile } from "./lib/load-env.mjs";

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function findUserByEmail(client, email) {
  let page = 1;

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(error.message);
    }

    const users = data.users ?? [];
    const match = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (match) {
      return match;
    }

    if (users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function main() {
  loadEnvFile();

  const email = getArgValue("--email");

  if (!email) {
    console.error("Usage: npm run supabase:promote-admin -- --email admin@example.com");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in frontend/.env."
    );
    process.exit(1);
  }

  const client = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const user = await findUserByEmail(client, email);

  if (!user) {
    console.error(`No auth user found for ${email}. Create the account first, then rerun this command.`);
    process.exit(1);
  }

  const { error: profileError } = await client
    .from("profiles")
    .update({
      role: "admin",
      approval_status: "approved",
    })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  const userMetadata = {
    ...(user.user_metadata ?? {}),
    role: "admin",
  };

  const { error: authError } = await client.auth.admin.updateUserById(user.id, {
    user_metadata: userMetadata,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  console.log(`Promoted ${email} to an approved admin profile.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
});
