import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import User from './models/User.js';
import Project from './models/Project.js';
import Ticket from './models/Ticket.js';
import Comment from './models/Comment.js';

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Comment.deleteMany({});
        await Ticket.deleteMany({});
        await Project.deleteMany({});
        await User.deleteMany({});

        // Create demo users
        console.log('👤 Creating demo users...');

        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@bugtracker.com',
            password: 'demo123',
            role: 'admin',
        });

        const adminUser = await User.create({
            name: 'Sarah Admin',
            email: 'admin@bugtracker.com',
            password: 'demo123',
            role: 'admin',
        });

        const developer1 = await User.create({
            name: 'Alex Chen',
            email: 'alex@bugtracker.com',
            password: 'demo123',
            role: 'developer',
        });

        const developer2 = await User.create({
            name: 'Mike Wilson',
            email: 'mike@bugtracker.com',
            password: 'demo123',
            role: 'developer',
        });

        const developer3 = await User.create({
            name: 'Emily Davis',
            email: 'emily@bugtracker.com',
            password: 'demo123',
            role: 'developer',
        });

        const designer = await User.create({
            name: 'Lisa Park',
            email: 'lisa@bugtracker.com',
            password: 'demo123',
            role: 'developer',
        });

        const qa = await User.create({
            name: 'David Brown',
            email: 'david@bugtracker.com',
            password: 'demo123',
            role: 'developer',
        });

        const pm = await User.create({
            name: 'Jennifer Lee',
            email: 'pm@bugtracker.com',
            password: 'demo123',
            role: 'admin',
        });

        console.log('✅ 8 Demo users created!');

        // Create demo projects
        console.log('📁 Creating demo projects...');

        const projects = await Project.insertMany([
            {
                title: 'E-Commerce Platform',
                description: 'Full-stack e-commerce with React, Node.js, Stripe payments, and real-time inventory.',
                status: 'active',
                admin: demoUser._id,
                teamMembers: [demoUser._id, developer1._id, developer2._id, designer._id, qa._id],
            },
            {
                title: 'Mobile Banking App',
                description: 'Secure React Native banking app with biometric auth and real-time transactions.',
                status: 'active',
                admin: adminUser._id,
                teamMembers: [adminUser._id, demoUser._id, developer1._id, developer3._id, designer._id],
            },
            {
                title: 'Healthcare Management System',
                description: 'HIPAA-compliant patient management with appointments, records, and billing.',
                status: 'active',
                admin: pm._id,
                teamMembers: [pm._id, developer1._id, developer2._id, qa._id, demoUser._id],
            },
            {
                title: 'AI Chat Assistant',
                description: 'GPT-powered customer support chatbot with multi-language support.',
                status: 'active',
                admin: demoUser._id,
                teamMembers: [demoUser._id, developer3._id, developer1._id, pm._id, qa._id],
            },
            {
                title: 'Learning Management System',
                description: 'Online education platform with courses, quizzes, certificates, and analytics.',
                status: 'active',
                admin: adminUser._id,
                teamMembers: [adminUser._id, developer2._id, designer._id, pm._id, qa._id],
            },
            {
                title: 'Real Estate Marketplace',
                description: 'Property listing platform with virtual tours, maps integration, and agent portal.',
                status: 'active',
                admin: developer2._id,
                teamMembers: [developer2._id, demoUser._id, developer1._id, designer._id, pm._id],
            },
            {
                title: 'Food Delivery App',
                description: 'On-demand food delivery with real-time tracking, payments, and restaurant dashboard.',
                status: 'completed',
                admin: pm._id,
                teamMembers: [pm._id, developer2._id, developer3._id, qa._id, demoUser._id],
            },
            {
                title: 'Fitness Tracking App',
                description: 'Workout planner with progress tracking, diet plans, and social features.',
                status: 'active',
                admin: developer1._id,
                teamMembers: [developer1._id, demoUser._id, designer._id, qa._id, developer2._id],
            },
            {
                title: 'Project Management Tool',
                description: 'Jira-like project tracking with Kanban boards, sprints, and team collaboration.',
                status: 'completed',
                admin: adminUser._id,
                teamMembers: [adminUser._id, demoUser._id, developer1._id, developer2._id, pm._id],
            },
            {
                title: 'Social Media Dashboard',
                description: 'Analytics dashboard for social media with scheduled posts and engagement metrics.',
                status: 'archived',
                admin: designer._id,
                teamMembers: [designer._id, demoUser._id, developer3._id, pm._id, adminUser._id],
            },
        ]);

        console.log('✅ 10 Demo projects created!');

        // Create demo tickets - Lots of realistic tickets
        console.log('🎫 Creating demo tickets...');

        const allTickets = [];

        // Project 1: E-Commerce Platform - 12 tickets (3 assigned to demoUser)
        allTickets.push(
            { title: 'Implement product search with filters', description: 'Add search functionality with category, price range, and rating filters. Include autocomplete suggestions.', priority: 'high', status: 'done', project: projects[0]._id, createdBy: demoUser._id, assignedTo: demoUser._id },
            { title: 'Shopping cart persistence', description: 'Cart items should persist across sessions using localStorage and sync with database for logged users.', priority: 'high', status: 'in-progress', project: projects[0]._id, createdBy: demoUser._id, assignedTo: demoUser._id },
            { title: 'Stripe checkout integration', description: 'Integrate Stripe for secure payments. Support credit cards, Apple Pay, and Google Pay.', priority: 'high', status: 'in-progress', project: projects[0]._id, createdBy: adminUser._id, assignedTo: demoUser._id },
            { title: 'Order tracking system', description: 'Real-time order status with email notifications. Support tracking numbers and delivery estimates.', priority: 'medium', status: 'to-do', project: projects[0]._id, createdBy: pm._id, assignedTo: demoUser._id },
            { title: 'Product review & ratings', description: 'Allow verified buyers to leave reviews. Calculate average rating and display helpfulness scores.', priority: 'medium', status: 'to-do', project: projects[0]._id, createdBy: demoUser._id, assignedTo: developer3._id },
            { title: 'Wishlist feature', description: 'Users can save items to wishlist. Show stock alerts for wishlist items.', priority: 'low', status: 'to-do', project: projects[0]._id, createdBy: qa._id, assignedTo: designer._id },
            { title: 'Mobile responsiveness issues', description: 'Fix product grid on tablet devices. Navigation menu breaks on iPad Pro.', priority: 'high', status: 'in-progress', project: projects[0]._id, createdBy: qa._id, assignedTo: demoUser._id },
            { title: 'Performance optimization', description: 'Lazy load images, implement infinite scroll for product listing. Target < 3s load time.', priority: 'medium', status: 'to-do', project: projects[0]._id, createdBy: developer1._id, assignedTo: developer1._id },
            { title: 'Admin dashboard analytics', description: 'Sales charts, inventory alerts, customer insights. Export to PDF/CSV.', priority: 'medium', status: 'to-do', project: projects[0]._id, createdBy: pm._id, assignedTo: developer2._id },
            { title: 'Coupon system', description: 'Percentage and fixed discounts. Support for first-time buyers and bulk orders.', priority: 'low', status: 'done', project: projects[0]._id, createdBy: demoUser._id, assignedTo: demoUser._id },
            { title: 'Email notifications not sending', description: 'Order confirmation emails failing for Gmail accounts. Check SMTP settings.', priority: 'high', status: 'done', project: projects[0]._id, createdBy: qa._id, assignedTo: developer2._id },
            { title: 'Add dark mode support', description: 'Implement dark/light theme toggle. Persist preference in user settings.', priority: 'low', status: 'to-do', project: projects[0]._id, createdBy: designer._id, assignedTo: demoUser._id },
        );

        // Project 2: Mobile Banking App - 10 tickets
        allTickets.push(
            { title: 'Biometric authentication', description: 'Implement Face ID and fingerprint login. Fallback to PIN code.', priority: 'high', status: 'done', project: projects[1]._id, createdBy: adminUser._id, assignedTo: developer1._id },
            { title: 'Real-time balance updates', description: 'WebSocket connection for instant balance refresh after transactions.', priority: 'high', status: 'done', project: projects[1]._id, createdBy: demoUser._id, assignedTo: developer3._id },
            { title: 'Fund transfer feature', description: 'Transfer between own accounts, to other users, and external bank transfers.', priority: 'high', status: 'in-progress', project: projects[1]._id, createdBy: adminUser._id, assignedTo: developer1._id },
            { title: 'Transaction history filters', description: 'Filter by date range, type, amount. Search by merchant name.', priority: 'medium', status: 'in-progress', project: projects[1]._id, createdBy: developer1._id, assignedTo: developer3._id },
            { title: 'Bill payment integration', description: 'Pay utilities, mobile recharge, credit cards. Schedule recurring payments.', priority: 'medium', status: 'to-do', project: projects[1]._id, createdBy: pm._id, assignedTo: developer1._id },
            { title: 'Push notifications', description: 'Transaction alerts, low balance warning, promotional offers.', priority: 'medium', status: 'done', project: projects[1]._id, createdBy: adminUser._id, assignedTo: developer3._id },
            { title: 'Security audit fixes', description: 'Address findings from penetration test. Update encryption protocols.', priority: 'high', status: 'in-progress', project: projects[1]._id, createdBy: qa._id, assignedTo: developer1._id },
            { title: 'Card management', description: 'Block/unblock cards, set spending limits, view PIN, order replacement.', priority: 'medium', status: 'to-do', project: projects[1]._id, createdBy: demoUser._id, assignedTo: developer3._id },
            { title: 'Statement download', description: 'Generate monthly statements in PDF. Email option and in-app viewer.', priority: 'low', status: 'to-do', project: projects[1]._id, createdBy: adminUser._id, assignedTo: developer1._id },
            { title: 'App crashes on Android 12', description: 'Crash on launch for Samsung Galaxy devices running Android 12.', priority: 'high', status: 'done', project: projects[1]._id, createdBy: qa._id, assignedTo: developer3._id },
        );

        // Project 3: Healthcare Management - 8 tickets
        allTickets.push(
            { title: 'Patient registration flow', description: 'Multi-step registration with documents upload and insurance verification.', priority: 'high', status: 'done', project: projects[2]._id, createdBy: pm._id, assignedTo: developer1._id },
            { title: 'Appointment scheduling', description: 'Calendar view for available slots. SMS and email reminders.', priority: 'high', status: 'done', project: projects[2]._id, createdBy: developer1._id, assignedTo: developer2._id },
            { title: 'Electronic health records', description: 'HIPAA-compliant storage. Version history and audit logs.', priority: 'high', status: 'in-progress', project: projects[2]._id, createdBy: pm._id, assignedTo: developer1._id },
            { title: 'Prescription management', description: 'E-prescriptions with pharmacy integration. Refill requests.', priority: 'medium', status: 'in-progress', project: projects[2]._id, createdBy: developer2._id, assignedTo: developer2._id },
            { title: 'Insurance billing module', description: 'Claims submission, tracking, and EOB processing.', priority: 'high', status: 'to-do', project: projects[2]._id, createdBy: pm._id, assignedTo: developer1._id },
            { title: 'Telemedicine integration', description: 'Video consultations with Zoom/WebRTC. Screen sharing for reports.', priority: 'medium', status: 'to-do', project: projects[2]._id, createdBy: qa._id, assignedTo: developer2._id },
            { title: 'Patient portal login issues', description: 'Password reset emails not arriving. Session timeout too short.', priority: 'medium', status: 'done', project: projects[2]._id, createdBy: qa._id, assignedTo: developer1._id },
            { title: 'Reporting dashboard', description: 'Patient demographics, appointment stats, revenue reports.', priority: 'low', status: 'to-do', project: projects[2]._id, createdBy: pm._id, assignedTo: developer2._id },
        );

        // Project 4: AI Chat Assistant - 6 tickets (2 assigned to demoUser)
        allTickets.push(
            { title: 'GPT-4 integration', description: 'Connect OpenAI API. Implement context management and token optimization.', priority: 'high', status: 'done', project: projects[3]._id, createdBy: demoUser._id, assignedTo: demoUser._id },
            { title: 'Multi-language support', description: 'Auto-detect language. Support English, Spanish, French, German, Chinese.', priority: 'high', status: 'in-progress', project: projects[3]._id, createdBy: developer1._id, assignedTo: demoUser._id },
            { title: 'Conversation history', description: 'Store chat sessions. Allow users to continue or review past conversations.', priority: 'medium', status: 'done', project: projects[3]._id, createdBy: demoUser._id, assignedTo: developer1._id },
            { title: 'Knowledge base integration', description: 'Train on company documents and FAQs. Regular updates from CMS.', priority: 'high', status: 'in-progress', project: projects[3]._id, createdBy: developer3._id, assignedTo: developer3._id },
            { title: 'Human handoff feature', description: 'Escalate to human agent when AI confidence is low or user requests.', priority: 'medium', status: 'to-do', project: projects[3]._id, createdBy: pm._id, assignedTo: demoUser._id },
            { title: 'Response quality improvement', description: 'Reduce hallucinations. Improve factual accuracy with RAG.', priority: 'high', status: 'to-do', project: projects[3]._id, createdBy: qa._id, assignedTo: developer3._id },
        );

        // Project 5: LMS - 7 tickets
        allTickets.push(
            { title: 'Course builder module', description: 'Drag-drop lesson sequencing. Support video, text, quizzes, assignments.', priority: 'high', status: 'done', project: projects[4]._id, createdBy: adminUser._id, assignedTo: developer2._id },
            { title: 'Quiz engine with grading', description: 'Multiple choice, true/false, fill-in-blanks. Auto-grading and feedback.', priority: 'high', status: 'done', project: projects[4]._id, createdBy: pm._id, assignedTo: developer2._id },
            { title: 'Certificate generation', description: 'Custom templates for completion certificates. Verification QR code.', priority: 'medium', status: 'in-progress', project: projects[4]._id, createdBy: designer._id, assignedTo: designer._id },
            { title: 'Student progress tracking', description: 'Time spent, completion rate, quiz scores. Visual analytics.', priority: 'medium', status: 'in-progress', project: projects[4]._id, createdBy: adminUser._id, assignedTo: developer2._id },
            { title: 'Discussion forums', description: 'Course-specific forums. Q&A threads with instructor responses.', priority: 'low', status: 'to-do', project: projects[4]._id, createdBy: pm._id, assignedTo: developer2._id },
            { title: 'Video player buffering issues', description: 'Videos buffer excessively on slow connections. Need adaptive streaming.', priority: 'high', status: 'done', project: projects[4]._id, createdBy: qa._id, assignedTo: developer2._id },
            { title: 'Mobile app for learners', description: 'React Native app for on-the-go learning. Offline video download.', priority: 'medium', status: 'to-do', project: projects[4]._id, createdBy: adminUser._id, assignedTo: developer3._id },
        );

        // Project 6: Real Estate - 6 tickets
        allTickets.push(
            { title: 'Property listing page', description: 'Grid/list view, advanced filters, map integration with clusters.', priority: 'high', status: 'done', project: projects[5]._id, createdBy: demoUser._id, assignedTo: developer1._id },
            { title: 'Virtual tour integration', description: '360° photos and walkthrough videos. Matterport integration.', priority: 'high', status: 'in-progress', project: projects[5]._id, createdBy: designer._id, assignedTo: developer1._id },
            { title: 'Mortgage calculator', description: 'EMI calculator with interest rates. Compare loan options.', priority: 'medium', status: 'done', project: projects[5]._id, createdBy: demoUser._id, assignedTo: developer1._id },
            { title: 'Agent profiles & ratings', description: 'Agent listing with reviews, sold properties, contact form.', priority: 'medium', status: 'in-progress', project: projects[5]._id, createdBy: pm._id, assignedTo: designer._id },
            { title: 'Saved searches with alerts', description: 'Save search criteria. Email alerts for new matching properties.', priority: 'low', status: 'to-do', project: projects[5]._id, createdBy: developer1._id, assignedTo: developer1._id },
            { title: 'Map not loading on Safari', description: 'Google Maps fails to load on iOS Safari. Console shows API error.', priority: 'high', status: 'done', project: projects[5]._id, createdBy: qa._id, assignedTo: developer1._id },
        );

        // Project 7: Food Delivery (Completed) - 5 tickets
        allTickets.push(
            { title: 'Restaurant onboarding', description: 'Self-service signup with menu builder and photo upload.', priority: 'high', status: 'done', project: projects[6]._id, createdBy: pm._id, assignedTo: developer2._id },
            { title: 'Real-time order tracking', description: 'GPS tracking of delivery. ETA updates. Driver contact.', priority: 'high', status: 'done', project: projects[6]._id, createdBy: developer2._id, assignedTo: developer3._id },
            { title: 'Multiple payment methods', description: 'Cards, UPI, wallets, COD. Split payments for groups.', priority: 'high', status: 'done', project: projects[6]._id, createdBy: pm._id, assignedTo: developer2._id },
            { title: 'Rating & review system', description: 'Rate food, delivery, restaurant. Photo reviews.', priority: 'medium', status: 'done', project: projects[6]._id, createdBy: qa._id, assignedTo: developer3._id },
            { title: 'Final QA & launch', description: 'Complete testing checklist. Performance benchmarks. Go-live.', priority: 'high', status: 'done', project: projects[6]._id, createdBy: pm._id, assignedTo: qa._id },
        );

        // Project 8: Fitness App - 5 tickets
        allTickets.push(
            { title: 'Workout library', description: '500+ exercises with videos. Filter by muscle group, equipment.', priority: 'high', status: 'done', project: projects[7]._id, createdBy: developer1._id, assignedTo: developer1._id },
            { title: 'Custom workout builder', description: 'Create routines from library. Set reps, sets, rest times.', priority: 'high', status: 'in-progress', project: projects[7]._id, createdBy: demoUser._id, assignedTo: developer1._id },
            { title: 'Progress tracking', description: 'Weight logs, body measurements, photos. Chart visualization.', priority: 'medium', status: 'in-progress', project: projects[7]._id, createdBy: designer._id, assignedTo: designer._id },
            { title: 'Social features', description: 'Follow friends, share workouts, challenges. Leaderboards.', priority: 'low', status: 'to-do', project: projects[7]._id, createdBy: developer1._id, assignedTo: demoUser._id },
            { title: 'Apple Watch integration', description: 'Sync heart rate, calories. Show workout on watch.', priority: 'medium', status: 'to-do', project: projects[7]._id, createdBy: demoUser._id, assignedTo: developer1._id },
        );

        // Project 9: Project Management (Completed) - 4 tickets
        allTickets.push(
            { title: 'Kanban board with drag-drop', description: 'Three columns: To-Do, In Progress, Done. Smooth animations.', priority: 'high', status: 'done', project: projects[8]._id, createdBy: adminUser._id, assignedTo: demoUser._id },
            { title: 'Sprint planning module', description: 'Create sprints, add tickets, track velocity.', priority: 'high', status: 'done', project: projects[8]._id, createdBy: demoUser._id, assignedTo: developer1._id },
            { title: 'Time tracking', description: 'Log time on tickets. Reports by user, project, period.', priority: 'medium', status: 'done', project: projects[8]._id, createdBy: pm._id, assignedTo: developer2._id },
            { title: 'Integrations', description: 'GitHub commits, Slack notifications, calendar sync.', priority: 'low', status: 'done', project: projects[8]._id, createdBy: developer1._id, assignedTo: developer2._id },
        );

        // Project 10: Social Media Dashboard (Archived) - 3 tickets
        allTickets.push(
            { title: 'Multi-platform connection', description: 'Connect Instagram, Twitter, Facebook, LinkedIn. OAuth flow.', priority: 'high', status: 'done', project: projects[9]._id, createdBy: demoUser._id, assignedTo: developer3._id },
            { title: 'Post scheduling', description: 'Schedule posts with media. Calendar view. Auto-publish.', priority: 'high', status: 'done', project: projects[9]._id, createdBy: designer._id, assignedTo: developer3._id },
            { title: 'Analytics dashboard', description: 'Followers, engagement, reach. Comparison charts.', priority: 'medium', status: 'done', project: projects[9]._id, createdBy: demoUser._id, assignedTo: developer3._id },
        );

        const tickets = await Ticket.insertMany(allTickets);
        console.log(`✅ ${tickets.length} Demo tickets created!`);

        // Create demo comments
        console.log('💬 Creating demo comments...');

        const comments = [];

        // Add realistic comments to various tickets
        const commentTemplates = [
            { text: "Started working on this. Will update by EOD.", user: developer1._id },
            { text: "Code review completed. Looks good! Minor suggestions in PR.", user: developer2._id },
            { text: "Blocked by API changes. Need backend team input.", user: developer3._id },
            { text: "QA passed! Ready for deployment.", user: qa._id },
            { text: "Great work! Moving to production next sprint.", user: pm._id },
            { text: "Updated the design mockups. Please review.", user: designer._id },
            { text: "Fixed the edge case. Please re-test.", user: developer1._id },
            { text: "Performance improved by 40%. Check metrics.", user: developer2._id },
            { text: "Customer feedback incorporated. Thanks all!", user: demoUser._id },
            { text: "Dependencies updated. No breaking changes.", user: developer3._id },
            { text: "Documentation added to Wiki.", user: adminUser._id },
            { text: "Sprint demo recorded. Shared in #general.", user: pm._id },
        ];

        // Add 2-3 comments to first 20 tickets
        for (let i = 0; i < Math.min(20, tickets.length); i++) {
            const numComments = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numComments; j++) {
                const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
                comments.push({
                    ticket: tickets[i]._id,
                    user: template.user,
                    text: template.text,
                });
            }
        }

        await Comment.insertMany(comments);
        console.log(`✅ ${comments.length} Demo comments created!`);

        // Summary
        console.log('\n========================================');
        console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
        console.log('========================================\n');
        console.log('📧 DEMO LOGIN CREDENTIALS:');
        console.log('----------------------------------------');
        console.log('Email: demo@bugtracker.com');
        console.log('Password: demo123');
        console.log('----------------------------------------');
        console.log('Other accounts (same password: demo123):');
        console.log('  - sarah@bugtracker.com (Admin)');
        console.log('  - alex@bugtracker.com (Developer)');
        console.log('  - mike@bugtracker.com (Developer)');
        console.log('  - emily@bugtracker.com (Developer)');
        console.log('  - lisa@bugtracker.com (Designer)');
        console.log('  - david@bugtracker.com (QA)');
        console.log('  - jennifer@bugtracker.com (PM)');
        console.log('========================================\n');
        console.log('📊 Created:');
        console.log(`   - 8 Users`);
        console.log(`   - ${projects.length} Projects`);
        console.log(`   - ${tickets.length} Tickets`);
        console.log(`   - ${comments.length} Comments`);
        console.log('\n✅ You can now login at http://localhost:5173');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

seedDatabase();
