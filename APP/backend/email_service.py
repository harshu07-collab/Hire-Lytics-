"""
Email Service Module
Handles OTP and notification emails using Resend
"""
import os
from typing import Optional, List
from email.mime.text import MIMEText
import smtplib
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Try to import Resend, fallback to SMTP if not available
RESEND_AVAILABLE = False  # Temporarily disable resend due to domain verification requirement
logger.warning("Resend requires domain verification, using SMTP fallback")

EMAIL_FROM = os.environ.get("EMAIL_FROM")
EMAIL_SENDER_NAME = os.environ.get("EMAIL_SENDER_NAME", "Hire-Lytics")

# SMTP Configuration (fallback)
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_REQUIRE_AUTH = os.environ.get("SMTP_REQUIRE_AUTH", "true").lower() in ("1", "true", "yes")

if not EMAIL_FROM:
    EMAIL_FROM = SMTP_USER or "noreply@hirelytic.com"

class EmailService:
    def __init__(self):
        self.use_resend = RESEND_AVAILABLE
        if self.use_resend:
            from resend import Resend
            api_key = os.environ.get("RESEND_API_KEY", "")
            self.resend = Resend(api_key=api_key)
        
    async def send_otp_email(
        self,
        to: str,
        otp: str,
        name: Optional[str] = None,
        email_type: str = "signup"
    ) -> bool:
        """Send OTP email"""
        try:
            subject = f"Your {EMAIL_SENDER_NAME} OTP Code"
            
            if email_type == "signup":
                html_body = f"""
                <h2>Welcome to {EMAIL_SENDER_NAME}!</h2>
                <p>Hello {name or 'User'},</p>
                <p>Your one-time password (OTP) is:</p>
                <h1 style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px;">{otp}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
                <hr>
                <p>Best regards,<br/>{EMAIL_SENDER_NAME} Team</p>
                """
            else:  # login
                html_body = f"""
                <h2>{EMAIL_SENDER_NAME} Login Verification</h2>
                <p>Hello,</p>
                <p>Your one-time password (OTP) is:</p>
                <h1 style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px;">{otp}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email or change your password immediately.</p>
                <hr>
                <p>Best regards,<br/>{EMAIL_SENDER_NAME} Team</p>
                """
            
            if self.use_resend:
                return await self._send_via_resend(to, subject, html_body)
            else:
                return await self._send_via_smtp(to, subject, html_body)
        
        except Exception as e:
            logger.error(f"Error sending OTP email to {to}: {str(e)}")
            return False
    
    async def send_welcome_email(
        self,
        to: str,
        name: str
    ) -> bool:
        """Send welcome email after successful signup"""
        try:
            subject = f"Welcome to {EMAIL_SENDER_NAME}!"
            html_body = f"""
            <h2>Welcome to {EMAIL_SENDER_NAME}, {name}!</h2>
            <p>Your account has been successfully created.</p>
            <p>You can now access all features of our platform:</p>
            <ul>
                <li>Resume Analysis with AI</li>
                <li>Professional Resume Templates</li>
                <li>Career Optimization Tips</li>
                <li>Real-time Feedback</li>
            </ul>
            <p><a href="http://localhost:3000" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started Now</a></p>
            <hr>
            <p>Questions? Contact us at support@hirelytic.com</p>
            <p>Best regards,<br/>{EMAIL_SENDER_NAME} Team</p>
            """
            
            if self.use_resend:
                return await self._send_via_resend(to, subject, html_body)
            else:
                return await self._send_via_smtp(to, subject, html_body)
        
        except Exception as e:
            logger.error(f"Error sending welcome email to {to}: {str(e)}")
            return False
    
    async def _send_via_resend(self, to: str, subject: str, html_body: str) -> bool:
        """Send email via Resend API"""
        try:
            response = self.resend.emails.send({
                "from": f"{EMAIL_SENDER_NAME} <{EMAIL_FROM}>",
                "to": to,
                "subject": subject,
                "html": html_body
            })

            logger.info(f"Email sent to {to} via Resend: {response.get('id', 'unknown')}")
            return True
        except Exception as e:
            logger.error(f"Error sending via Resend: {str(e)}")
            return False
    
    async def _send_via_smtp(self, to: str, subject: str, html_body: str) -> bool:
        """Send email via SMTP (fallback)"""
        try:
            if SMTP_REQUIRE_AUTH and (not SMTP_USER or not SMTP_PASSWORD):
                logger.error("SMTP credentials missing; cannot send email")
                return False

            msg = MIMEText(html_body, "html")
            msg["Subject"] = subject
            msg["From"] = f"{EMAIL_SENDER_NAME} <{EMAIL_FROM}>"
            msg["To"] = to
            
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                if SMTP_USER and SMTP_PASSWORD:
                    server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"Email sent to {to} via SMTP")
            return True
        except Exception as e:
            logger.error(f"Error sending via SMTP: {str(e)}")
            return False

# Singleton instance
email_service = EmailService()

async def send_otp_email(to: str, otp: str, name: Optional[str] = None, email_type: str = "signup") -> bool:
    """Convenience function to send OTP email"""
    return await email_service.send_otp_email(to, otp, name, email_type)

async def send_welcome_email(to: str, name: str) -> bool:
    """Convenience function to send welcome email"""
    return await email_service.send_welcome_email(to, name)
