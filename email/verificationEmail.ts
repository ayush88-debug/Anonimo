


export function VerificationEmail(username: string, otp: string):string {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <title>Your Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- header bar -->
    <div style="background-color:#4f46e5; padding:16px; text-align:center;">
      <h1 style="color:#ffffff; font-size:24px; margin:0;">Anonimo</h1>
    </div>
    
    <!-- body -->
    <div style="padding:24px;">
      <h2 style="font-size:20px; color:#333333; margin-top:0;">
        Hello ${username},
      </h2>
      <p style="font-size:16px; color:#555555; line-height:1.5;">
        Thank you for registering with Anonimo! Please use the verification code below to complete your sign-up:
      </p>
      
      <!-- code “button” -->
      <div style="text-align:center; margin:24px 0;">
        <span style="display:inline-block; padding:12px 24px; background-color:#4f46e5; color:#ffffff; font-size:18px; font-weight:bold; border-radius:4px; text-decoration:none;">
          ${otp}
        </span>
      </div>
      
      <p style="font-size:14px; color:#777777; line-height:1.5; margin-top:0;">
        If you didn’t request this code, simply ignore this email. This code will expire in 1 hour.
      </p>
    </div>
  </div>
</body>
</html>
`;
}