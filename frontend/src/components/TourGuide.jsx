import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TOUR_STEPS = [
    {
        target: 'body',
        title: 'Welcome to BugTracker! 👋',
        content: 'Your new Jira-like project management tool. Let us show you around!',
        position: 'center',
        route: '/dashboard'
    },
    {
        target: '.dashboard-stats', // I need to add this class to Dashboard
        title: 'Project Overview 📊',
        content: 'See all your active projects, ticket stats, and team activity at a glance.',
        position: 'bottom',
        route: '/dashboard'
    },
    {
        target: '.quick-actions', // I need to add this class
        title: 'Quick Actions ⚡',
        content: 'Create projects, view your tickets, or jump to recent work instantly.',
        position: 'top',
        route: '/dashboard'
    },
    {
        target: '.nav-projects', // I need to add this class to Sidebar/Navbar
        title: 'Projects Hub 📁',
        content: 'Manage all your projects here. Create new ones or archive old ones.',
        position: 'right',
        route: '/projects'
    }
];

const TourGuide = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('bugtracker_tour_completed');
        if (!hasSeenTour) {
            // Delay start slightly
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, []);

    // Effect to navigate if step requires it
    useEffect(() => {
        if (!isVisible) return;

        const step = TOUR_STEPS[currentStep];
        if (step.route && location.pathname !== step.route) {
            navigate(step.route);
        }
    }, [currentStep, isVisible, location.pathname, navigate]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('bugtracker_tour_completed', 'true');
    };

    if (!isVisible) return null;

    const step = TOUR_STEPS[currentStep];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop with hole logic is hard in pure CSS without library, 
                so we'll use a simple centered modal for the welcome step 
                and a positioned tooltip for others */}

            <div className="absolute inset-0 bg-black/60 pointer-events-auto" />

            <div className="relative pointer-events-auto glass-card p-6 max-w-md w-full animate-scale-in z-[101]">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-dark-900">
                    {currentStep + 1}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 mb-6">{step.content}</p>

                <div className="flex justify-between items-center">
                    <button
                        onClick={handleComplete}
                        className="text-gray-500 hover:text-white text-sm"
                    >
                        Skip Tour
                    </button>

                    <button
                        onClick={handleNext}
                        className="btn-primary"
                    >
                        {currentStep === TOUR_STEPS.length - 1 ? 'Finish 🚀' : 'Next →'}
                    </button>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-1 mt-4">
                    {TOUR_STEPS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-primary-500' : 'bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TourGuide;
