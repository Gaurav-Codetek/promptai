# Prompt-AI

## Overview

Prompt-AI is a library that automates AI-powered newsletter generation. It scrapes content from a given URL, generates structured newsletters using **Google's Gemini API**, and provides features for parsing content, sending emails, and creating blog page links.

---

## Features
- **AI Content Generation:** Uses Google's **Gemini API** to generate newsletters based on scraped content.
- **Email Sending:** Sends AI-generated newsletters via **SMTP**.
- **Blog Page Link Generation:** Creates links for blog pages in both local and live environments.

---

## Docs link
- promptai (PyPi) - [Docs](https://pypi.org/project/prompt-ai/) 
- promptai (NPM) -  [Docs](https://www.npmjs.com/package/promptai)

## Installation

### Python
```sh
pip install promptai
```

### Node.js
```sh
npm install promptai
```

---

## Usage

### 1. Generate AI-Powered Newsletter

#### _apiKey_:
- Generate your API key from [Gemini API](https://ai.google.dev/gemini-api/docs).

#### _link_:
- Enter a reference link for which you want to generate a newsletter and blog article.

#### **Python**
```python
from promptai import generate_content

api_key = "your-google-gemini-api-key"
title = "Latest Tech Trends"
category = "Technology"
link = "https://example.com/tech-news"

newsletter = generate_content(title, category, link, api_key)
print(newsletter)
```

#### **Node.js**
```javascript
import { generateContent } from "promptai";

const apiKey = "your-google-gemini-api-key";
const title = "Latest Tech Trends";
const category = "Technology";
const link = "https://example.com/tech-news";

generateContent(title, category, link, apiKey)
  .then((newsletter) => console.log(newsletter))
  .catch((error) => console.error(error));
```

#### Response (Success)
```json
{
  "title": "generated-title",
  "content": [
    {
      "subtitle": "generated-subtitle",
      "paragraph": "generated-inner-paragraph"
    }
  ],
  "tags": "generated tags for the blog",
  "category": "assigned category"
}
```

#### Response (Failed)
```json
{
  "status": 203,
  "message": "Content not generated",
  "reason": "internal issue"
}
```

---

### 2. Send Newsletter via Email

#### SMTP Configuration
- Update **SMTP_SERVER** and **SMTP_PORT** for your email provider.
- Use an **App Password** for secure authentication.

#### **Python**
```python
from promptai import send_email

receiver_email = "recipient@example.com"  # Or ["comma-separated emails"]
sender_email = "your-email@example.com"
email_app_password = "your-email-app-password"
link = "generated-link-of-blog"
title = "generated-title"
description = "first-para-of-first-subtitle"
subject = "Your-subject-here"

send_email(receiver_email, sender_email, email_app_password, link, title, description, subject)
```

#### **Node.js**
```javascript
import { sendEmail } from "promptai";

const receiverEmail = "recipient@example.com"; // Or ["comma-separated emails"]
const senderEmail = "your-email@example.com";
const emailAppPassword = "your-email-app-password";
const link = "generated-link-of-blog";
const title = "generated-title";
const description = "first-para-of-first-subtitle";
const subject = "Your-subject-here";

sendEmail(
  receiverEmail,
  senderEmail,
  emailAppPassword,
  link,
  title,
  description,
  subject
)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

#### Response (Success)
```json
{ "status": 200, "message": "Email sent successfully" }
```

#### Response (Failed)
```json
{
  "status": 203,
  "message": "Error in sending mail",
  "reason": "reason-of-error"
}
```

---

### 3. Create Blog Page Link

#### _domainName_:
- Enter only the **specific part** of your domain name.
- Examples:
  - Local: `localhost:3000` → `domain_name: localhost:3000`
  - Live: `https://example.com` → `domain_name: example.com`

#### _domainType_:
- **"local"**: If using Prompt-AI on an unsecured network (localhost).
- **"live"**: For domains hosted on a secured network (`https://your-domain.com`).

#### _title_:
- Use the same title that you received from `generateContent`.

#### **Python**
```python
from promptai import create_blog_page

domain_name = "yourwebsite.com"
domain_type = "live"
title = "The Future of AI"

blog_link = create_blog_page(title, domain_type, domain_name)
print(blog_link)
```

#### **Node.js**
```javascript
import { createBlogPage } from "promptai";

const domainName = "yourwebsite.com";
const domainType = "live";
const title = "The Future of AI";

createBlogPage(title, domainType, domainName)
  .then((blogLink) => console.log(blogLink))
  .catch((error) => console.error(error));
```

#### Response (Success)
```json
{
  "status": 200,
  "message": "Link generated",
  "link": "generated_link"
}
```

#### Response (Failed)
```json
{
  "status": 203,
  "message": "Error generating link",
  "reason": "domain type not specified"
}
```

---

## License

This project is licensed under the **MIT License**.

## Contributions

Feel free to submit pull requests or report issues on **GitHub**.

## Contact

For inquiries or support, reach out at `gauravpatel29@outlook.in`.

