/**
 * Email service for sending notifications to committee and users
 * Uses Resend API (https://resend.com)
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const COMMITTEE_EMAILS = (process.env.COMMITTEE_EMAILS || "").split(",").filter(Boolean);
export const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@lowveldshowsociety.com";

export async function sendRegistrationNotification(profile: {
  full_name: string;
  email: string;
  company_name: string;
  category: string;
  phone: string;
  calculated_total_usd: number;
  payment_reference: string;
}) {
  try {
    // Send to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      subject: "LSS 2026 - Registration Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Successful! 🎉</h2>
          <p>Hi ${profile.full_name},</p>
          <p>Thank you for registering for the Lowveld Agricultural Show & Trade Fair 2026.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Registration Details:</h3>
            <p><strong>Company:</strong> ${profile.company_name}</p>
            <p><strong>Category:</strong> ${profile.category.replace(/_/g, " ")}</p>
            <p><strong>Contact:</strong> ${profile.phone}</p>
            <p><strong>Amount Due:</strong> $${profile.calculated_total_usd}</p>
            <p><strong>Payment Reference:</strong> ${profile.payment_reference}</p>
          </div>

          <h3>Next Steps:</h3>
          <ol>
            <li>Log in to your exhibitor portal</li>
            <li>Navigate to the Payment section</li>
            <li>Transfer the required amount to one of the bank accounts listed</li>
            <li>Upload your proof of payment (bank statement/receipt)</li>
          </ol>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            For assistance, contact Fidelis Harry (Treasurer) at +263 77 242 6985 or lowveldshowsociety4@gmail.com
          </p>
        </div>
      `,
    });

    // Send to committee
    if (COMMITTEE_EMAILS.length > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: COMMITTEE_EMAILS,
        subject: `New Registration: ${profile.company_name} - ${profile.calculated_total_usd} USD`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Exhibitor Registration</h2>
            <p style="color: #28a745; font-weight: bold;">A new exhibitor has registered for LSS 2026.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Exhibitor Information:</h3>
              <p><strong>Name:</strong> ${profile.full_name}</p>
              <p><strong>Email:</strong> ${profile.email}</p>
              <p><strong>Company:</strong> ${profile.company_name}</p>
              <p><strong>Category:</strong> ${profile.category.replace(/_/g, " ")}</p>
              <p><strong>Phone:</strong> ${profile.phone}</p>
              <p><strong>Amount Due:</strong> $${profile.calculated_total_usd}</p>
              <p><strong>Payment Reference:</strong> ${profile.payment_reference}</p>
            </div>

            <p style="color: #666; font-size: 12px;">
              Status: Awaiting payment and proof of payment upload
            </p>
          </div>
        `,
      });
    }

    return { ok: true };
  } catch (error) {
    console.error("Failed to send registration email:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Email send failed" };
  }
}

export async function sendPaymentUploadNotification(profile: {
  full_name: string;
  email: string;
  company_name: string;
  payment_reference: string;
  calculated_total_usd: number;
}) {
  try {
    // Send to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      subject: "LSS 2026 - Proof of Payment Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Proof of Payment Received ✓</h2>
          <p>Hi ${profile.full_name},</p>
          <p>We have received your proof of payment (POP) for LSS 2026 registration.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Reference:</strong> ${profile.payment_reference}</p>
            <p><strong>Amount:</strong> $${profile.calculated_total_usd}</p>
            <p><strong>Status:</strong> <span style="color: #ff9800;">Pending Verification</span></p>
          </div>

          <p>Our verification team will review your payment within 24-48 hours. You will receive another email once your registration is approved.</p>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Need help? Contact Fidelis Harry at +263 77 242 6985
          </p>
        </div>
      `,
    });

    // Send to committee
    if (COMMITTEE_EMAILS.length > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: COMMITTEE_EMAILS,
        subject: `POP Upload: ${profile.company_name} - ${profile.payment_reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Proof of Payment Uploaded</h2>
            <p>Exhibitor <strong>${profile.full_name}</strong> from <strong>${profile.company_name}</strong> has uploaded proof of payment.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Reference:</strong> ${profile.payment_reference}</p>
              <p><strong>Amount Due:</strong> $${profile.calculated_total_usd}</p>
              <p><strong>Email:</strong> ${profile.email}</p>
            </div>

            <p style="color: #ff9800; font-weight: bold;">Action Required: Please verify the payment and approve the registration in the admin dashboard.</p>
          </div>
        `,
      });
    }

    return { ok: true };
  } catch (error) {
    console.error("Failed to send payment upload email:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Email send failed" };
  }
}

export async function sendVerificationApprovedNotification(profile: {
  full_name: string;
  email: string;
  company_name: string;
  payment_reference: string;
}) {
  try {
    // Send to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      subject: "LSS 2026 - Registration Approved ✓",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Approved! 🎉</h2>
          <p>Hi ${profile.full_name},</p>
          <p>Congratulations! Your registration for LSS 2026 has been verified and approved.</p>
          
          <div style="background: #4caf50; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Exhibitor Status: VERIFIED</h3>
            <p style="margin: 0;"><strong>Company:</strong> ${profile.company_name}</p>
            <p style="margin: 0;"><strong>Payment Reference:</strong> ${profile.payment_reference}</p>
          </div>

          <h3>You now have access to:</h3>
          <ul>
            <li>Exhibitor Portal - Manage your booth and networking materials</li>
            <li>B2B Trade Directory - Connect with other exhibitors</li>
            <li>Event Schedule - Full agenda and session details</li>
            <li>Digital Entry Badges - For all attendees</li>
            <li>Committee Contact Directory - Direct communication</li>
          </ul>

          <p><strong>Event Dates:</strong> August 6-8, 2026</p>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Log in to your portal to get started: <a href="https://lowveldshowsociety.com/portal" style="color: #28a745;">View Portal</a>
          </p>
        </div>
      `,
    });

    // Send to committee
    if (COMMITTEE_EMAILS.length > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: COMMITTEE_EMAILS,
        subject: `Registration Approved: ${profile.company_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Registration Approved</h2>
            <p><strong>${profile.company_name}</strong> (${profile.full_name}) has been approved and verified.</p>
            
            <p><strong>Payment Reference:</strong> ${profile.payment_reference}</p>
            <p style="color: #4caf50; font-weight: bold;">Status: VERIFIED ✓</p>
          </div>
        `,
      });
    }

    return { ok: true };
  } catch (error) {
    console.error("Failed to send approval email:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Email send failed" };
  }
}

export async function sendVerificationRejectedNotification(profile: {
  full_name: string;
  email: string;
  company_name: string;
  payment_reference: string;
  rejection_reason?: string;
}) {
  try {
    // Send to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      subject: "LSS 2026 - Registration Review Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Registration Review Required</h2>
          <p>Hi ${profile.full_name},</p>
          <p>Your registration for LSS 2026 requires additional review or correction.</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0; color: #856404;">Reason for Review:</h3>
            <p style="color: #856404; margin: 0;">${profile.rejection_reason || "Please contact the committee for details."}</p>
          </div>

          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Log in to your exhibitor portal</li>
            <li>Review the feedback provided</li>
            <li>Upload corrected proof of payment (POP) if needed</li>
            <li>Our team will re-verify your registration</li>
          </ol>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Questions? Contact Fidelis Harry (Treasurer) at +263 77 242 6985 or lowveldshowsociety4@gmail.com
          </p>
        </div>
      `,
    });

    // Send to committee
    if (COMMITTEE_EMAILS.length > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: COMMITTEE_EMAILS,
        subject: `Registration Rejected: ${profile.company_name} - ${profile.payment_reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Registration Rejection Recorded</h2>
            <p><strong>${profile.company_name}</strong> (${profile.full_name}) registration has been rejected.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Payment Reference:</strong> ${profile.payment_reference}</p>
              <p><strong>Reason:</strong> ${profile.rejection_reason || "Not specified"}</p>
            </div>

            <p>Exhibitor has been notified and can resubmit with corrected information.</p>
          </div>
        `,
      });
    }

    return { ok: true };
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Email send failed" };
  }
}
