import { Injectable } from '@angular/core';

export interface ProviderProfileDraft {
  businessName: string;
  experienceYears: number;
  address: string;
  serviceRadius: number;
  serviceDesc: string;
  businessOverview: string;
  contactName: string;
  phone: string;
  altPhone: string;
  supportEmail: string;
  alertSms: boolean;
  alertPayout: boolean;
}

export interface ProviderPaymentDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
  preferredMode: 'bank' | 'upi';
}

export interface ProviderKycDetails {
  aadhaarNo: string;
  panNo: string;
  selfieAdded: boolean;
  addressProofAdded: boolean;
  aadhaarDocName: string;
  panDocName: string;
  selfieDocName: string;
  addressProofName: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderSettingsService {
  private readonly profileKey = 'provider_profile_draft';
  private readonly paymentKey = 'provider_payment_details';
  private readonly kycKey = 'provider_kyc_details';

  getProfileDraft(fallback: ProviderProfileDraft): ProviderProfileDraft {
    return this.read(this.profileKey, fallback);
  }

  saveProfileDraft(value: ProviderProfileDraft): void {
    this.write(this.profileKey, value);
  }

  getPaymentDetails(fallback: ProviderPaymentDetails): ProviderPaymentDetails {
    return this.read(this.paymentKey, fallback);
  }

  savePaymentDetails(value: ProviderPaymentDetails): void {
    this.write(this.paymentKey, value);
  }

  getKycDetails(fallback: ProviderKycDetails): ProviderKycDetails {
    return this.read(this.kycKey, fallback);
  }

  saveKycDetails(value: ProviderKycDetails): void {
    this.write(this.kycKey, value);
  }

  private read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return this.clone(fallback);
      return { ...this.clone(fallback), ...JSON.parse(raw) };
    } catch {
      return this.clone(fallback);
    }
  }

  private write<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}
