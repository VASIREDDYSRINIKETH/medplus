import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

def send_low_stock_email(supplier_email: str, medicine_name: str, reorder_amount: int):
    sender_email = os.environ.get("SMTP_EMAIL", "")
    sender_password = os.environ.get("SMTP_PASSWORD", "")
    
    if not sender_email or not sender_password or sender_password == "dummy_password_here":
        print(f"[EMAIL MOCK] Would send email to {supplier_email} about {medicine_name}")
        return

    # Message exact format requested by user
    body = f"Low stock for {medicine_name}. Send {reorder_amount} more."
    
    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = f"CRITICAL: Low Stock Alert - {medicine_name}"
    msg["From"] = sender_email
    msg["To"] = supplier_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print(f"[EMAIL SUCCESS] Alert definitively sent to {supplier_email}")
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {supplier_email}. Error: {str(e)}")
