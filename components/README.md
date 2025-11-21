# 📘 Clerk `useUser()` — Complete Developer Guide

The `useUser()` hook from **@clerk/nextjs** gives you full access to the authenticated user’s profile and identity.
It is the **primary way** to fetch user information on the client side in Next.js.

---

## 🔧 **Basic Usage**

```tsx
"use client";

import { useUser } from "@clerk/nextjs";

export default function Component() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      <h1>Hello {user.firstName}</h1>
      <p>User ID: {user.id}</p>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
    </>
  );
}
```

---

# 🧩 **Fields Provided by `useUser()`**

Below is a structured breakdown of all fields the `user` object exposes.

---

## 🔑 **1. Identity & Basic Information**

| Field        | Description                                        |
| ------------ | -------------------------------------------------- |
| `id`         | **Unique, permanent user ID** (best for databases) |
| `firstName`  | User's first name                                  |
| `lastName`   | User’s last name                                   |
| `fullName`   | Combination of first + last name                   |
| `username`   | Username (if enabled)                              |
| `imageUrl`   | User profile image URL                             |
| `hasImage`   | Whether user uploaded an image                     |
| `externalId` | ID from your own external system                   |

---

## 📬 **2. Contact Information**

| Field                   | Description                         |
| ----------------------- | ----------------------------------- |
| `emailAddresses`        | Array of all linked email addresses |
| `primaryEmailAddress`   | Primary email object                |
| `primaryEmailAddressId` | ID of primary email                 |
| `phoneNumbers`          | Array of all phone numbers          |
| `primaryPhoneNumber`    | Primary phone object                |
| `primaryPhoneNumberId`  | ID of primary phone                 |

---

## 🌐 **3. External Accounts & Web3**

| Field                        | Description                  |
| ---------------------------- | ---------------------------- |
| `externalAccounts`           | All OAuth external accounts  |
| `verifiedExternalAccounts`   | Verified OAuth accounts      |
| `unverifiedExternalAccounts` | Unverified OAuth accounts    |
| `enterpriseAccounts`         | SAML/SSO Enterprise accounts |
| `web3Wallets`                | Connected Web3 wallets       |
| `primaryWeb3Wallet`          | Wallet used during signup    |
| `verifiedWeb3Wallets`        | Verified wallets             |

---

## 🔒 **4. Authentication & Security**

| Field               | Description                        |
| ------------------- | ---------------------------------- |
| `passwordEnabled`   | Whether password exists            |
| `twoFactorEnabled`  | 2FA enabled or not                 |
| `totpEnabled`       | TOTP authenticator setup           |
| `backupCodeEnabled` | Backup login codes status          |
| `passkeys`          | List of passkeys for passkey login |

---

## ✔️ **5. Verification Status**

| Field                     | Description               |
| ------------------------- | ------------------------- |
| `hasVerifiedEmailAddress` | Whether email is verified |
| `hasVerifiedPhoneNumber`  | Whether phone is verified |

---

## 🏢 **6. Organization Memberships**

| Field                     | Description                           |
| ------------------------- | ------------------------------------- |
| `organizationMemberships` | List of organizations user belongs to |

---

## 🗃️ **7. Metadata**

| Field             | Accessible From    | Description                     |
| ----------------- | ------------------ | ------------------------------- |
| `publicMetadata`  | Frontend & Backend | Publicly readable data          |
| `privateMetadata` | Backend only       | Sensitive internal data         |
| `unsafeMetadata`  | Frontend           | User-editable frontend metadata |

---

## ⚙️ **8. Permissions & Settings**

| Field                       | Description                           |
| --------------------------- | ------------------------------------- |
| `createOrganizationEnabled` | Whether user can create orgs          |
| `createOrganizationsLimit`  | Org creation limit                    |
| `deleteSelfEnabled`         | Whether user can delete their account |

---

## 🕒 **9. Timestamps**

| Field             | Description                       |
| ----------------- | --------------------------------- |
| `createdAt`       | When the user account was created |
| `updatedAt`       | Last profile update time          |
| `lastSignInAt`    | Timestamp of last sign-in         |
| `legalAcceptedAt` | When user accepted legal docs     |

---

# 🔥 **Most Important Field (For Databases)**

### ✅ `user.id`

- Permanent
- Globally unique
- Never changes
- Best identifier for storing chat history, profiles, or user-bound data

---

# 🎯 Example Usage in Backend (via `auth()`)

```ts
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = auth();

  if (!userId) return new Response("Unauthorized", { status: 401 });

  // Use userId to store or fetch user-specific data
}
```

---

# 📝 **Conclusion**

The `useUser()` hook in Clerk provides a complete user profile object containing identity, contact details, authentication status, external accounts, metadata, and more.
For almost all production use cases—especially chat apps, SaaS dashboards, or personalized databases—**`user.id` should be your primary unique key.**

---
