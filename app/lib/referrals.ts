import { client } from "./apiClient";
import type { ReferralResponse, ReferralCreate, ReferralUpdate } from "./types";

export async function getAllReferrals(): Promise<ReferralResponse[]> {
  const { data, error } = await client.GET("/referrals/me");

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function getReferralById(
  referralId: number,
): Promise<ReferralResponse> {
  const { data, error } = await client.GET("/referrals/{referral_id}", {
    params: { path: { referral_id: referralId } },
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function createReferral(
  payload: ReferralCreate,
): Promise<ReferralResponse> {
  const { data, error } = await client.POST("/referrals/", {
    body: payload,
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function updateReferral(
  referralId: number,
  payload: ReferralUpdate,
): Promise<ReferralResponse> {
  const { data, error } = await client.PUT("/referrals/{referral_id}", {
    params: { path: { referral_id: referralId } },
    body: payload,
  });

  if (error) throw new Error(JSON.stringify(error));
  return data;
}

export async function deleteReferral(referralId: number): Promise<void> {
  const { error } = await client.DELETE("/referrals/{referral_id}", {
    params: { path: { referral_id: referralId } },
  });

  if (error) throw new Error(JSON.stringify(error));
}
