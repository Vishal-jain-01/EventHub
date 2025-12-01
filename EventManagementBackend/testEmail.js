import { config } from 'dotenv';
import pkg from 'nodemailer';
const { createTransport } = pkg;

// Load environment variables
config();

const testEmailConfiguration = async () => {
    console.log('🔍 Testing Email Configuration...\n');
    
    // Check environment variables
    console.log('📧 Email User:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not Set');
    console.log('🔑 Email Password:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not Set');
    console.log('🌐 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:5175');
    console.log('');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('❌ ERROR: EMAIL_USER and EMAIL_PASSWORD must be set in .env file');
        console.log('\nPlease follow the instructions in EMAIL_SETUP.md');
        process.exit(1);
    }
    
    // Create test transporter
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    try {
        console.log('🔄 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');
        
        // Send test email
        console.log('📨 Sending test email...');
        const testEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: '✅ EventHub Email Configuration Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                        <h1>✅ Success!</h1>
                    </div>
                    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 10px; margin-top: 20px;">
                        <h2>Email Configuration Test Successful</h2>
                        <p>Congratulations! Your EventHub backend email configuration is working correctly.</p>
                        <p><strong>Configuration Details:</strong></p>
                        <ul>
                            <li>Email Service: Gmail</li>
                            <li>Sender: ${process.env.EMAIL_USER}</li>
                            <li>Status: ✅ Active</li>
                        </ul>
                        <p>You can now receive:</p>
                        <ul>
                            <li>✅ Event creation confirmations</li>
                            <li>✅ Registration confirmations</li>
                            <li>✅ Event fully booked notifications</li>
                        </ul>
                        <p style="margin-top: 30px; color: #666; font-size: 12px;">
                            This is a test email from EventHub Backend<br>
                            Generated on ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully!');
        console.log(`📬 Check your inbox at: ${process.env.EMAIL_USER}\n`);
        
        console.log('🎉 Email configuration is complete and working!');
        console.log('You can now start the backend server with: npm start\n');
        
    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Verify EMAIL_USER is a valid Gmail address');
        console.log('2. Verify EMAIL_PASSWORD is an App Password (not your Gmail password)');
        console.log('3. Ensure 2-Step Verification is enabled on your Gmail account');
        console.log('4. Check that you copied the App Password correctly (no spaces)');
        console.log('\nSee EMAIL_SETUP.md for detailed instructions\n');
        process.exit(1);
    }
};

testEmailConfiguration();
