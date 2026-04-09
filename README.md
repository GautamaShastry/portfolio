# Modern Portfolio Template 🚀

A modern, feature-rich personal portfolio website template built with **React.js**, **Vite**, **Redux Toolkit**, and **Tailwind CSS**. This template is fully customizable and ready to deploy on **AWS Cloud**.

🌐 Live Demo: [gautamportfolio.com](https://gautamportfolio.com/)

---

## 🎯 Use This Template

**This portfolio template is open source and free to use!** Feel free to clone, customize, and deploy it for your own portfolio. All you need to do is update the content in `src/constants/index.js` with your information.

---

## ✨ Features

### Core Features
- 🎨 **Modern UI/UX** with smooth animations via Framer Motion
- 🌓 **Dark/Light theme toggle** with persistent preferences
- 📱 **Fully responsive** design for all devices
- 🌍 **Multi-language support** (English, Hindi, Telugu, German, French, Japanese, Chinese)
- 🎮 **Interactive Code Breaker game** with secret recruiter page
- 💬 **AI-powered chatbot** with dynamic portfolio context
- 📧 **Contact form** with EmailJS integration
- ⚡ **Optimized performance** with React memoization and lazy loading

### Technical Features
- 🏗️ **Redux Toolkit** for state management with feature slices
- 🔄 **Dynamic content generation** from constants
- 🎯 **SEO-friendly** with meta tags and semantic HTML
- 🔒 **HTTPS-secured** deployment on AWS
- 📊 **Modular component architecture** for easy customization

---

## �️ Tech Stack

**Frontend:**
- React.js 18 with Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- i18next for internationalization

**Backend (Chatbot):**
- Python FastAPI
- AWS Bedrock (Claude)
- Docker containerization

**Cloud Infrastructure:**
- AWS S3 for static hosting
- CloudFront CDN with OAI
- Route 53 for DNS
- AWS Certificate Manager for SSL/TLS
- CloudWatch for monitoring

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio-template.git

# Navigate into project
cd portfolio-template

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your EmailJS credentials to .env
# VITE_EMAILJS_SERVICE_ID=your_service_id
# VITE_EMAILJS_TEMPLATE_ID=your_template_id
# VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see your portfolio!

---

## 🎨 Customization Guide

### 1. Update Your Information

Edit `src/constants/index.js` to add your:
- Personal details (name, title, bio)
- Projects and descriptions
- Work experience
- Education
- Skills and technologies
- Certifications
- Social media links
- Contact information

### 2. Replace Images

Add your images to `src/assets/projects/`:
- Profile photo
- Project screenshots
- Certification images

### 3. Configure EmailJS

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Add credentials to `.env` file

### 4. Customize Styling

- Modify `tailwind.config.js` for theme colors
- Update `src/index.css` for global styles
- Adjust component styles in individual files

### 5. Setup Chatbot (Optional)

Navigate to `chatbot-backend/` and follow the setup:

```bash
cd chatbot-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure AWS credentials and run
python main.py
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to AWS

1. **Create S3 Bucket:**
   - Enable static website hosting
   - Upload contents of `/dist` folder

2. **Setup CloudFront:**
   - Create distribution with S3 as origin
   - Configure Origin Access Identity (OAI)
   - Attach SSL certificate from ACM

3. **Configure Route 53:**
   - Add A record pointing to CloudFront
   - Configure DNS settings

4. **Enable Monitoring:**
   - Setup CloudWatch alarms
   - Configure health checks

For detailed AWS deployment guide, see [AWS Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html).

---

## 🎮 Special Features

### Code Breaker Game
- Interactive 4-digit guessing game
- Unlocks secret recruiter page on completion
- Visual feedback with color-coded hints

### AI Chatbot
- Powered by AWS Bedrock (Claude)
- Dynamically learns from your portfolio content
- Answers questions about your experience and projects

### Multi-language Support
- 7 languages supported out of the box
- Easy to add more languages in `src/i18n/locales/`

---

## 📁 Project Structure

```
portfolio-template/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── store/            # Redux store and slices
│   ├── constants/        # Portfolio data
│   ├── i18n/             # Internationalization
│   ├── utils/            # Utility functions
│   └── assets/           # Images and static files
├── chatbot-backend/      # Python FastAPI chatbot
├── public/               # Public assets
└── dist/                 # Production build (generated)
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 👨‍💻 Original Author

**Satya Subrahmanya Gautama Shastry Bulusu Venkata**  
📧 [gautamashastry@gmail.com](mailto:gautamashastry@gmail.com)  
💼 [LinkedIn](https://linkedin.com/in/satya2603)  
🌐 [gautamportfolio.com](https://gautamportfolio.com/)

---

## 📄 License

This project is licensed under the **MIT License** - feel free to use it for your own portfolio!

---

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Animated with Framer Motion
- Icons from React Icons
- Deployed on AWS Cloud

---

## ⭐ Show Your Support

If you found this template helpful, please consider:
- ⭐ Starring the repository
- 🍴 Forking it for your own use
- 📢 Sharing it with others
- 💬 Providing feedback

---

**Happy coding! 🚀**
