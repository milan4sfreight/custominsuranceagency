import { supabase } from "@/integrations/supabase/client";

export interface SendQuoteEmailInput {
  subject: string;
  source: string;
  fields: Record<string, unknown>;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export async function sendQuoteEmail(input: SendQuoteEmailInput) {
  const { data, error } = await supabase.functions.invoke("send-quote-email", {
    body: input,
  });
  if (error) throw error;
  if (data && (data as { error?: string }).error) {
    throw new Error((data as { error: string }).error);
  }
  return data;
}

export const SUCCESS_MSG = "Thank you! We will contact you within 24 hours.";
export const ERROR_MSG = "Something went wrong. Please call us at 708-810-1955.";