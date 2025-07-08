import smtplib
import logging
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)

def send_verification_email(to_email: str, link: str) -> None:
    """
    Send a simple HTML email with a verification link.
    """
    # Build message
    msg = EmailMessage()
    msg["Subject"] = "Please verify your email address"
    msg["From"]    = settings.from_address or settings.smtp_user
    msg["To"]      = to_email

    # Plain‑text fallback
    msg.set_content(
        f"Hi there,\n\n"
        f"Please verify your email by visiting:\n{link}\n\n"
        "If you didn't request this, ignore this email."
    )

    # HTML version
    msg.add_alternative(f"""
    <html><body>
      <p>Hi there,</p>
      <p>Please verify your email by clicking below:</p>
      <p>
        <a href="{link}"
           style="background:#1a73e8;color:#fff;padding:10px 20px;
                  text-decoration:none;border-radius:4px;">
          Verify Email
        </a>
      </p>
      <p>If you didn't request this, ignore this email.</p>
    </body></html>
    """, subtype="html")

    # Send via SMTP with STARTTLS
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
            logger.info("Verification email sent to %s", to_email)
    except Exception:
        logger.exception("Failed to send verification email to %s", to_email)
        # Optionally re‑raise or implement retry logic here

def send_reset_password_email(to_email: str, link: str) -> None:
    """
    Send a simple HTML email with a password reset link.
    """
    # Build message
    msg = EmailMessage()
    msg["Subject"] = "Password Reset Request"
    msg["From"]    = settings.from_address or settings.smtp_user
    msg["To"]      = to_email

    # Plain‑text fallback
    msg.set_content(
        f"Hi there,\n\n"
        f"We received a request to reset your password. You can reset it by visiting:\n{link}\n\n"
        "If you didn't request this, you can safely ignore this email."
    )

    # HTML version
    msg.add_alternative(f"""
    <html><body>
      <p>Hi there,</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <p>
        <a href="{link}"
           style="background:#e53935;color:#fff;padding:10px 20px;
                  text-decoration:none;border-radius:4px;">
          Reset Password
        </a>
      </p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </body></html>
    """, subtype="html")

    # Send via SMTP with STARTTLS
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
            logger.info("Password reset email sent to %s", to_email)
    except Exception:
        logger.exception("Failed to send password reset email to %s", to_email)
        # Optionally re‑raise or implement retry logic here
