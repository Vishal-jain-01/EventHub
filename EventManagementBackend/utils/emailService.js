import pkg from 'nodemailer';
const { createTransport } = pkg;

// Create reusable transporter
const createTransporter = () => {
    return createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Email template for event creation confirmation
export const sendEventCreationEmail = async (userEmail, userName, eventDetails) => {
    const transporter = createTransporter();
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Event Created Successfully - ${eventDetails.eventName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .event-details { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .detail-row { display: flex; margin: 10px 0; }
                    .detail-label { font-weight: bold; width: 150px; color: #667eea; }
                    .detail-value { flex: 1; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Event Created Successfully!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName},</h2>
                        <p>Congratulations! Your event has been created successfully on EventHub.</p>
                        
                        <div class="event-details">
                            <h3>Event Details:</h3>
                            <div class="detail-row">
                                <span class="detail-label">Event Name:</span>
                                <span class="detail-value">${eventDetails.eventName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Date:</span>
                                <span class="detail-value">${new Date(eventDetails.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Time:</span>
                                <span class="detail-value">${new Date(eventDetails.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Venue:</span>
                                <span class="detail-value">${eventDetails.eventVenue}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Total Seats:</span>
                                <span class="detail-value">${eventDetails.TotalSeats}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Category:</span>
                                <span class="detail-value">${eventDetails.eventCategory}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">${eventDetails.eventType}</span>
                            </div>
                        </div>
                        
                        <p>Your event is now live and users can start registering for it!</p>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5175'}/dashboard" class="button">View Dashboard</a>
                        </div>
                        
                        <p style="margin-top: 30px;">We'll notify you when:</p>
                        <ul>
                            <li>Users register for your event</li>
                            <li>Your event reaches full capacity</li>
                            <li>It's time to prepare for your event</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from EventHub</p>
                        <p>&copy; 2025 EventHub. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Event creation email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending event creation email:', error);
        return false;
    }
};

// Email template for event registration confirmation
export const sendRegistrationConfirmationEmail = async (userEmail, userName, eventDetails, registrationDetails) => {
    const transporter = createTransporter();
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Registration Confirmed - ${eventDetails.eventName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .event-details { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .detail-row { display: flex; margin: 10px 0; }
                    .detail-label { font-weight: bold; width: 180px; color: #667eea; }
                    .detail-value { flex: 1; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .ticket { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Registration Confirmed!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName},</h2>
                        <p>Great news! You have successfully registered for <strong>${eventDetails.eventName}</strong>.</p>
                        
                        <div class="ticket">
                            <h3>🎫 Your Event Ticket</h3>
                            <p>Registration ID: <strong>${registrationDetails.registrationId}</strong></p>
                        </div>
                        
                        <div class="event-details">
                            <h3>Event Information:</h3>
                            <div class="detail-row">
                                <span class="detail-label">Event Name:</span>
                                <span class="detail-value">${eventDetails.eventName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Date:</span>
                                <span class="detail-value">${new Date(eventDetails.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Time:</span>
                                <span class="detail-value">${new Date(eventDetails.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Venue:</span>
                                <span class="detail-value">${eventDetails.eventVenue}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Category:</span>
                                <span class="detail-value">${eventDetails.eventCategory}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">${eventDetails.eventType}</span>
                            </div>
                            ${eventDetails.eventPrice > 0 ? `
                            <div class="detail-row">
                                <span class="detail-label">Price:</span>
                                <span class="detail-value">₹${eventDetails.eventPrice}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="event-details">
                            <h3>Your Registration Details:</h3>
                            <div class="detail-row">
                                <span class="detail-label">Name:</span>
                                <span class="detail-value">${registrationDetails.name}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${registrationDetails.email}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Phone:</span>
                                <span class="detail-value">${registrationDetails.phone}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Registered On:</span>
                                <span class="detail-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        
                        <p><strong>Important:</strong> Please save this email for your records. You may need to present your registration ID at the event.</p>
                        
                        <p style="margin-top: 30px;">See you at the event!</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from EventHub</p>
                        <p>&copy; 2025 EventHub. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Registration confirmation email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending registration confirmation email:', error);
        return false;
    }
};

// Email template for event fully booked notification
export const sendEventFullyBookedEmail = async (hostEmail, hostName, eventDetails) => {
    const transporter = createTransporter();
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: hostEmail,
        subject: `🎉 Event Fully Booked - ${eventDetails.eventName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .stats-box { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                    .stat-item { display: inline-block; margin: 10px 20px; }
                    .stat-number { font-size: 36px; font-weight: bold; color: #667eea; }
                    .stat-label { font-size: 14px; color: #666; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎊 Congratulations!</h1>
                    </div>
                    <div class="content">
                        <div class="celebration">🎉 🎈 🎊 🥳</div>
                        
                        <h2>Hi ${hostName},</h2>
                        <p style="font-size: 18px; font-weight: bold; color: #667eea;">Your event is now FULLY BOOKED!</p>
                        
                        <p>We're excited to inform you that <strong>${eventDetails.eventName}</strong> has reached maximum capacity!</p>
                        
                        <div class="stats-box">
                            <div class="stat-item">
                                <div class="stat-number">${eventDetails.TotalSeats}</div>
                                <div class="stat-label">Total Registrations</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">100%</div>
                                <div class="stat-label">Capacity</div>
                            </div>
                        </div>
                        
                        <h3>Event Details:</h3>
                        <ul>
                            <li><strong>Event Name:</strong> ${eventDetails.eventName}</li>
                            <li><strong>Date:</strong> ${new Date(eventDetails.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                            <li><strong>Time:</strong> ${new Date(eventDetails.eventDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</li>
                            <li><strong>Venue:</strong> ${eventDetails.eventVenue}</li>
                        </ul>
                        
                        <p><strong>What's Next?</strong></p>
                        <ul>
                            <li>No new registrations will be accepted for this event</li>
                            <li>You can view all registered attendees in your dashboard</li>
                            <li>Prepare for a successful event!</li>
                        </ul>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5175'}/dashboard" class="button">View Attendee List</a>
                        </div>
                        
                        <p style="margin-top: 30px;">Best of luck with your event!</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message from EventHub</p>
                        <p>&copy; 2025 EventHub. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Event fully booked email sent to ${hostEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending event fully booked email:', error);
        return false;
    }
};
