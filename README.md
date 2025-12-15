# Gautam Portfolio 🚀

A modern, responsive personal portfolio website showcasing my projects, skills, certifications, and professional journey. Built with **React.js** and **Vite**, styled using **Tailwind CSS**, and securely deployed on **AWS Cloud**.

🌐 Live at: [gautamportfolio.com](https://gautamportfolio.com/)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite
- **Styling:** Tailwind CSS
- **Icons & Animations:** React Icons, Framer Motion
- **Email Service:** EmailJS
- **Cloud Hosting:** AWS S3, CloudFront, Route 53
- **Monitoring:** AWS CloudWatch

---

## ✨ Features

- Smooth scroll and responsive UI
- Animated page transitions via Framer Motion
- Email-enabled contact form using EmailJS
- SEO-friendly design and HTTPS-secured
- Modular components for easy customization

---

## 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/gautam-portfolio.git

# Navigate into project
cd gautam-portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🚀 Production Deployment

This project is deployed using **AWS static hosting architecture**:

- **Amazon S3**: Hosts the static React build.
- **Amazon CloudFront (via OAI)**: Global CDN distribution with HTTPS.
- **AWS Certificate Manager (ACM)**: TLS/SSL certificates for secure HTTPS.
- **Amazon Route 53**: DNS management for [gautamportfolio.com](https://gautamportfolio.com/).
- **AWS CloudWatch**: Monitoring health checks and availability.

### Deployment Steps

1. **Build the project:**

```bash
npm run build
```

2. Upload the generated `/dist` folder to **Amazon S3**.

### Configure CloudFront:

- Use **Origin Access Identity (OAI)** to restrict direct S3 access.
- Set **S3 bucket** as origin.
- Attach **SSL/TLS certificates** via **AWS Certificate Manager (ACM)**.
- Map domain via **Amazon Route 53**.
- Enforce **HTTPS** using CloudFront behaviors.

Use **AWS CloudWatch** for health checks and availability monitoring.

---

## 👨‍💻 Author

**Gautama Shastry**  
📧 [Contact via Portfolio](https://gautamportfolio.com/#contact)  
📧 [Contact via Linkedin](https://linkedin.com/in/satya2603)  
🌐 [gautamportfolio.com](https://gautamportfolio.com/)

---

## 📊 Profile Views Counter

![Profile Views](https://komarev.com/ghpvc/?username=your-github-username&style=flat-square)

---

## 🧰 Tech Toolbox

JavaScript • React.js • Vite • Tailwind CSS • EmailJS • Framer Motion  
Git • GitHub • AWS S3 • CloudFront • ACM • Route 53 • CloudWatch

---

## 📈 Future Enhancements

- Add personal blog section
- Implement Dark/Light theme toggle
- Integrate Google Analytics for traffic insights
- Optimize for Lighthouse performance scores

---

## 📄 License

Licensed under the **MIT License**.
