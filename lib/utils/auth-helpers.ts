import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "../supabaseAdmin";


export async function verifyOtp(email: string, otp: string) {
  const supabase = createBrowserClient();

  const isPasswordReset = sessionStorage.getItem('isPasswordReset') == 'true';

  const { data, error } = await supabase.auth.verifyOtp({
    token: otp,
    email,
    type: isPasswordReset ? 'recovery' : 'email',
  });

  if (error) throw error;

  return data;
}

export async function login(email: string, password: string) {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  const supabase = createBrowserClient();

  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function updatePassword(password: string) {
  const supabase = createBrowserClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
}