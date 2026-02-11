import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'development') {
    // For development, use ethereal email (fake SMTP service)
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    })
  }

  // For production, use real SMTP service
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })
}

// Send reset password email
export const sendResetPasswordEmail = async (email, resetToken) => {
  const transporter = createTransporter()

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3002'}/auth/reset-password?token=${resetToken}`

  const mailOptions = {
    from: `"晶礦飾品" <${process.env.SMTP_USER || 'noreply@crystal-jewelry.com'}>`,
    to: email,
    subject: '重設您的密碼 - 晶礦飾品',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">晶礦飾品</h1>
        </div>
        
        <div style="padding: 40px 20px; background-color: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">重設您的密碼</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            您收到此郵件是因為您（或某人）請求重設您在晶礦飾品的帳戶密碼。
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              重設密碼
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            如果您無法點擊上述按鈕，請複製以下連結到瀏覽器：<br>
            <a href="${resetUrl}" style="color: #8B5CF6; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            此連結將在10分鐘後過期。<br>
            如果您沒有請求重設密碼，請忽略此郵件。
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">© 2024 晶礦飾品. 保留所有權利。</p>
        </div>
      </div>
    `
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Password reset email would be sent to:', email)
    console.log('🔗 Reset URL:', resetUrl)
    // In development, just log instead of sending real email
    return Promise.resolve({ messageId: 'dev-mode' })
  }

  return await transporter.sendMail(mailOptions)
}

// Send welcome email
export const sendWelcomeEmail = async (email, firstName) => {
  const transporter = createTransporter()

  const mailOptions = {
    from: `"晶礦飾品" <${process.env.SMTP_USER || 'noreply@crystal-jewelry.com'}>`,
    to: email,
    subject: '歡迎加入晶礦飾品！',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">歡迎加入晶礦飾品</h1>
        </div>
        
        <div style="padding: 40px 20px;">
          <h2 style="color: #333;">親愛的 ${firstName}，</h2>
          
          <p style="color: #666; line-height: 1.6;">
            感謝您註冊晶礦飾品！我們很興奮能夠為您提供最優質的天然水晶飾品。
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            在晶礦飾品，您可以：
          </p>
          
          <ul style="color: #666; line-height: 1.8;">
            <li>瀏覽精選的天然水晶飾品</li>
            <li>享受安全便捷的購物體驗</li>
            <li>獲得專業的水晶知識與建議</li>
            <li>參與會員專屬活動與優惠</li>
          </ul>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3002'}" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              開始購物
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center;">
          <p style="color: #999; margin: 0;">祝您購物愉快！<br>晶礦飾品團隊</p>
        </div>
      </div>
    `
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Welcome email would be sent to:', email)
    return Promise.resolve({ messageId: 'dev-mode' })
  }

  return await transporter.sendMail(mailOptions)
}